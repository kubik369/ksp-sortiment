import db from 'sqlite';
import Promise from 'bluebird';
import fs from 'fs';
import moment from 'moment';
import {isNumber, toNumber} from 'lodash';

const logger = {
  log: (message) => console.log(`[${moment().format('HH:mm:ss L')}] ${message}`),
  error: (message) => console.error(`[${moment().format('HH:mm:ss L')}] ${message}`),
};

export async function getProducts(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json({products: await db.all('SELECT * FROM products')});
  } catch (err) {
    res.status(500).send('Could not get products');
  }
}

export async function getUsers(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.json({users: await db.all('SELECT * FROM users')});
  } catch (err) {
    res.status(500).send('Could not get users');
  }
}

export async function registerUser(req, res) {
  const {username, balance} = req.body;
  const userExists = await db.get(
    'SELECT * FROM users WHERE username=$username',
    {$username: username}
  );

  if (userExists || !username || !isNumber(toNumber(balance))) {
    res.status(500).send();
    return;
  }

  try {
    await db.run(
      'INSERT INTO users(username, balance) VALUES($username, $balance)',
      {$username: username, $balance: balance}
    );
    await db.run(
      'INSERT INTO logs(timestamp, user_id, balance_change, info) VALUES($ts, $user, $change, $info)',
      {$ts: moment().toISOString(), $user: username, $change: balance, $info: 'registration'}
    );
    logger.log(`Registered user ${username} with initial balance of ${balance}`);
    res.status(200).send();
  } catch (err) {
    logger.error(`Error during registration of user ${username}. Stack trace: ${err}`);
    res.status(500).send();
  }
}

export async function addCredit(req, res) {
  const {username, credit} = req.body;
  logger.log(`Adding ${credit} to ${username}`);

  if (!username || !isNumber(toNumber(credit))) {
    res.status(500).send();
    return;
  }

  try {
    await db.run(
      'UPDATE users SET balance = balance + $credit WHERE username=$username',
      {$credit: credit, $username: username}
    );
    await db.run(
      'INSERT INTO logs(timestamp, user_id, balance_change, info) VALUES($ts, $user, $change, $info)',
      {$ts: moment().toISOString(), $user: username, $change: credit, $info: 'credit'}
    );
    res.status(200).send();
  } catch (err) {
    logger.error('Credit adding failed');
    res.status(500).send();
  }
}

export async function buy(req, res) {
  const {cart, username, useCredit} = req.body;

  if (!cart || !username) {
    res.status(500).send();
    return;
  }

  const products = await db.all('SELECT * FROM products')
    .reduce((res, item) => ({...res, [item.id]: item}), {});

  for (let product of Object.values(products)) {
    if (cart[product.id]) {
      if (cart[product.id] > product.stock) {
        res.status(500).send(`Insufficient stock of ${product.label}`);
        return;
      } else if (cart[product.id] < 0) {
        res.status(500).send(`Negative amount of ${product.label}`);
        return;
      }
    }
  }

  const total = Object.values(products).reduce(
    (total, product) => total + product.price * cart[product.id], 0
  );

  try {
    // update all the bought stock
    await Promise.all(
      Object.keys(cart).map(
        (id) => db.run(
          'UPDATE products SET stock = stock - $amount WHERE id=$id',
          {$amount: cart[id], $id: id}
        )
      )
    );
    if (useCredit) {
      // update user balance
      await db.run(
        'UPDATE users SET balance = balance - $debit WHERE username=$username',
        {$debit: total, $username: username}
      );
    }
    await db.run(
      'INSERT INTO logs(timestamp, user_id, balance_change, info) VALUES($ts, $user, $debit, $info)',
      {
        $ts: moment().toISOString(),
        $user: username,
        $debit: useCredit ? -total : 0,
        $info: Object.keys(cart).map(
          (id) => cart[id] ? `${cart[id]} ${products[id].label}` : ''
        ).join(';'),
      }
    );
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
  const {username, label, quantity, price, uploadImage} = req.body;

  if (!(username && label && quantity && price)) {
    res.status(500).send();
    return;
  }

  if (uploadImage) {
    fs.writeFile(
      `./images/${label}.jpg`,
      new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      (err) => logger.error(err)
    );
  }

  const product = await db.get('SELECT price, stock FROM products WHERE label=$label', {$label: label});

  if (product) {
    const newPrice = getNewPrice(product.price, product.stock, price, quantity);

    try {
      await db.run(
        'UPDATE products SET stock = stock + $newStock, price=$newPrice WHERE label=$label;',
        {$newStock: quantity, $newPrice: newPrice, $label: label}
      );
      await db.run(
        'INSERT INTO logs(timestamp, user_id, info) VALUES($ts, $user, $info)',
        {
          $ts: moment().toISOString(),
          $user: username,
          $info: `stock;${label};${price};${quantity}`,
        }
      );
      res.status(200).send();
    } catch (err) {
      logger.error(`Error during re-stocking ${err}`);
      res.status(500).send();
    }
  } else {
    try {
      await db.run(
        'INSERT INTO products(label, price, stock) VALUES ($label, $price, $stock)',
        {$label: label, $price: price, $stock: quantity}
      );
      await db.run(
        'INSERT INTO logs(timestamp, user_id, info) VALUES($ts, $user, $info)',
        {
          $ts: moment().toISOString(),
          $user: username,
          $info: `stock;${label};${price};${quantity}`,
        }
      );
      res.status(200).send();
    } catch (err) {
      logger.error(`Error during re-stocking ${err}`);
      res.status(500).send();
    }
  }
}
