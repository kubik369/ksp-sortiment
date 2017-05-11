import Promise from 'bluebird';
import fs from 'fs';
import moment from 'moment';
import {isNumber, toNumber} from 'lodash';

import db from './db.js';

const logger = {
  log: (message) => console.log(`[${moment().format('HH:mm:ss L')}] ${message}`),
  error: (message) => console.error(`[${moment().format('HH:mm:ss L')}] ${message}`),
};

export async function getProducts(req, res) {
  try {
    const products = (await db('products').select())
      .reduce((all, product) => {
        all[product.barcode] = product;
        return all;
      }, {});

    res.setHeader('Content-Type', 'application/json');
    res.json({products});
  } catch (err) {
    res.status(500).send('Could not get products');
  }
}

export async function getUsers(req, res) {
  try {
    const users = (await db('users').select())
      .reduce((all, user) => {
        all[user.id] = user;
        return all;
      }, {});

    res.setHeader('Content-Type', 'application/json');
    res.json({users});
  } catch (err) {
    res.status(500).send('Could not get users');
  }
}

export async function registerUser(req, res) {
  const {username, isic, balance} = req.body;
  const userExists = await db('users').where({username}).select();

  if (userExists.length || !username || !isNumber(toNumber(balance))) {
    res.status(500).send();
    return;
  }

  try {
    await db('users')
      .insert({
        username,
        balance,
        ...(isic ? {isic} : {}), // insert ISIC too if applicable
      });

    logger.log(
      `Registered user ${username} with initial balance of ${balance} and ISIC number ${isic}`
    );
    res.status(200).send();
  } catch (err) {
    logger.error(`Error during registration of user ${username}. Stack trace: ${err}`);
    res.status(500).send();
  }
}

export async function addCredit(req, res) {
  const {userId, credit} = req.body;
  logger.log(`Adding ${credit} to user with id ${userId}`);

  if (!userId || !isNumber(toNumber(credit))) {
    res.status(500).send();
    return;
  }

  try {
    await db('users')
      .where({id: userId})
      .update({
        balance: db.raw(`balance + ${credit}`),
      });
    res.status(200).send();
  } catch (err) {
    logger.error('Credit adding failed');
    res.status(500).send();
  }
}

export async function buy(req, res) {
  const {cart, userId, useCredit} = req.body;

  if (!cart || !userId) {
    res.status(500).send();
    return;
  }

  const products = await db('products').select()
    .reduce((res, item) => ({...res, [item.barcode]: item}), {});
  console.log('PRODUCTS', products);
  for (let product of Object.values(products)) {
    if (cart[product.barcode]) {
      if (cart[product.barcode] > product.stock) {
        res.status(500).send(`Insufficient stock of ${product.name}`);
        return;
      } else if (cart[product.barcode] < 0) {
        res.status(500).send(`Negative amount of ${product.name}`);
        return;
      }
    }
  }

  const total = Object.values(products).reduce(
    (total, {barcode, price}) => total + price * cart[barcode], 0
  );
  console.log('TOTAL', total);

  try {
    // update all the bought stock
    const updateProduct = (barcode) => db('products')
      .where({barcode})
      .update({
        stock: db.raw(`stock - ${cart[barcode]}`),
      });

    await Promise.all(Object.keys(cart).map(updateProduct));

    if (useCredit) {
      // update user balance
      await db('users')
        .where({id: userId})
        .update({
          balance: db.raw(`balance - ${total}`),
        });
    }
    res.status(200).send();
  } catch (err) {
    logger.error(`Error during buying process. Stack trace: ${err}`);
    res.status(500).send();
  }
}

function getNewPrice(oldPrice, oldStock, newPrice, newStock) {
  newPrice = parseFloat(newPrice) || 0;
  newStock = parseInt(newStock, 10) || 0;
  const price = ((oldPrice * oldStock) + (newPrice * newStock)) / (oldStock + newStock);
  return (Math.ceil(price * 20) / 20).toFixed(2);
}

export async function addStock(req, res) {
  const {userId, barcode, name, quantity, price, uploadImage} = req.body;

  console.log(userId, barcode, name, quantity, price);
  if (!(userId && barcode && quantity && price)) {
    res.status(500).send();
    return;
  }

  if (uploadImage) {
    fs.writeFile(
      `./images/${barcode}.jpg`,
      new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      (err) => logger.error(err)
    );
  }

  const [product] = await db('products').where({barcode}).select('price', 'stock');

  if (product) {
    const newPrice = getNewPrice(product.price, product.stock, price, quantity);

    try {
      await db('products')
        .where({barcode})
        .update({
          stock: db.raw(`stock + ${quantity}`),
          price: newPrice,
        });
      res.status(200).send();
    } catch (err) {
      logger.error(`Error during re-stocking ${err}`);
      res.status(500).send();
    }
  } else {
    try {
      await db('products')
        .insert({
          barcode,
          name,
          price,
          stock: quantity,
        });
      res.status(200).send();
    } catch (err) {
      logger.error(`Error during re-stocking ${err}`);
      res.status(500).send();
    }
  }
}
