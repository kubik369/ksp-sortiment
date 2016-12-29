import db from 'sqlite';
import Promise from 'bluebird';
import fs from 'fs';
import moment from 'moment';

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

export function registerUser(req, res) {
  const {username, balance} = req.body;

  db.run(
    'INSERT INTO users(username, balance) VALUES($username, $balance)',
    {$username: username, $balance: balance}
  ).then(() => {
    return db.run(
      'INSERT INTO logs(timestamp, user_id, balance_change, info) VALUES($ts, $user, $change, $info)',
      {$ts: moment().toISOString(), $user: username, $change: balance, $info: 'registration'}
    );
  }).then(() => {
    console.log(`Registered user ${username} with initial balance of ${balance}`);
    res.status(200).send();
  }).catch((err) => {
    console.error(`Error during registration of user ${username}`, err);
    res.status(500).send();
  });
}

export function addCredit(req, res) {
  const {username, credit} = req.body;
  console.log('adding credit', username, credit);
  db.run(
    'UPDATE users SET balance = balance + $credit WHERE username=$username',
    {$credit: credit, $username: username}
  ).then(() => {
    return db.run(
      'INSERT INTO logs(timestamp, user_id, balance_change, info) VALUES($ts, $user, $change, $info)',
      {$ts: moment().toISOString(), $user: username, $change: credit, $info: 'credit'}
    );
  }).then(() => {
    console.log('success')
    res.status(200).send();
  }).catch(() => {
    res.status(500).send();
  })
}

export async function buy(req, res) {
  const {cart, username} = req.body;

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
    (total, product) =>  total + product.price * cart[product.id], 0
  );

  Promise.all(
    Object.keys(cart).map(
      (id) => db.run(
        'UPDATE products SET stock = stock - $amount WHERE id=$id',
        {$amount: cart[id], $id: id}
      )
    )
  ).then(() => {
    return db.run(
      'UPDATE users SET balance = balance - $debit WHERE username=$username',
      {$debit: total, $username: username}
    );
  }).then(() => {
    return db.run(
      'INSERT INTO logs(timestamp, user_id, balance_change, info) VALUES($ts, $user, $debit, $info)',
      {
        $ts: moment().toISOString(),
        $user: username,
        $debit: -total,
        $info: Object.keys(cart).map(
          (id) => cart[id] ? `${cart[id]} ${products[id].label}` : ''
        ).join(','),
      }
    );
  }).then(() => {
    res.status(200).send();
  }).catch(() => {
    res.status(500).send();
  });
}

function getNewPrice(oldPrice, oldStock, newPrice, newStock) {
  newPrice = parseFloat(newPrice) || 0;
  newStock = parseInt(newStock, 10) || 0;
  const price = ((oldPrice * oldStock) + (newPrice * newStock)) / (oldStock + newStock);
  return (Math.ceil(price * 20) / 20).toFixed(2);
}

export async function addStock(req, res) {
  const {username, label, quantity, price, uploadImage} = req.body;
  
  if (uploadImage) {
    fs.writeFile(
      `./images/${label}.jpg`,
      new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      (err) => console.log(err)
    );
  }

  const product = await db.get('SELECT price, stock FROM products WHERE label=$label', {$label: label});

  if (product) {
    const newPrice = getNewPrice(product.price, product.stock, price, quantity);
    
    db
      .run(
        'UPDATE products SET stock = stock + $newStock, price=$newPrice WHERE label=$label;',
        {$newStock: quantity, $newPrice: newPrice, $label: label}
      )
      .then(() => {
        return db.run(
          'INSERT INTO logs(timestamp, user_id, info) VALUES($ts, $user, $info)',
          {
            $ts: moment().toISOString(),
            $user: username,
            $info: `stock;${label};${price};${quantity}`,
          }
        )
      })
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        console.log('Error during re-stocking', err);
        res.status(500).send();
      });
  } else {
    db
      .run(
        'INSERT INTO products(label, price, stock) VALUES ($label, $price, $stock)',
        {
          $label: label,
          $price: price,
          $stock: quantity,
        }
      )
      .then(() => {
        return db.run(
          'INSERT INTO logs(timestamp, user_id, info) VALUES($ts, $user, $info)',
          {
            $ts: moment().toISOString(),
            $user: username,
            $info: `stock;${label};${price};${quantity}`,
          }
        )
      })
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        console.log('Error during re-stocking', err);
        res.status(500).send();
      });
  }
}
