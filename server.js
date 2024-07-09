import express from "express";
import bodyParser from "body-parser";
import pgPromise from 'pg-promise';
const pgp = pgPromise();
// Create a database connection
const db = pgp('postgres://newuser:newintel@localhost:5432/database');

const app = express();
const port = 3000;

db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// app.use("/, async (req,res) =>{
//     res.send("Hello this is working");
// })

// Test the connection
async function testConnection() {
    try {
        const c = await db.connect(); // Try to connect
        console.log('Postgres server version:', c.client.serverVersion);
        c.done(); // Release the connection
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
}

// Call the test function
testConnection();

// Endpoint to add a new user
app.post("/users", async (req, res) => {
    const { name, username, password, phonenumber, dateofbirth } = req.body;
    try {
        const newUser = await db.one(
            "INSERT INTO consumers (name, username, password, phonenumber, dateofbirth) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, username, password, phonenumber, dateofbirth]
        );
        res.json(newUser);
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ error: "Error adding user" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await db.any("SELECT * FROM consumers");
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: "Error fetching users" });
    }
});

app.get("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.query("SELECT * FROM consumers WHERE id = $1", [userId]);
        if (user.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json(user[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
});

// Endpoint to update a user by ID
app.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const { name, username, password, phonenumber, dateofbirth } = req.body;
    try {
        const updatedUser = await db.query(
            "UPDATE consumers SET name = $1, username = $2, password = $3, phonenumber = $4, dateofbirth = $5 WHERE id = $6 RETURNING *",
            [name, username, password, phonenumber, dateofbirth, userId]
        );
        if (updatedUser.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json(updatedUser[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
});

// Endpoint to delete a user by ID
app.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await db.query("DELETE FROM consumers WHERE id = $1 RETURNING *", [userId]);
        if (deletedUser.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json(deletedUser[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Endpoint to add a new service provider
app.post("/service-providers", async (req, res) => {
    const { name, service_industry, company_name, phone_number, password } = req.body;
    try {
        const newServiceProvider = await db.query(
            "INSERT INTO service_providers (name, service_industry, company_name, phone_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, service_industry, company_name, phone_number, password]
        );
        res.json(newServiceProvider);
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ error: "Error adding service provider" });
    }
});

// Endpoint to get all service providers
app.get("/service-providers", async (req, res) => {
    try {
        const allServiceProviders = await db.query("SELECT * FROM service_providers");
        res.json(allServiceProviders);
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ error: "Error fetching service providers" });
    }
});

// Endpoint to get a specific service provider by ID
app.get("/service-providers/:id", async (req, res) => {
    const serviceProviderId = req.params.id;
    try {
        const serviceProvider = await db.query("SELECT * FROM service_providers WHERE id = $1", [serviceProviderId]);
        if (serviceProvider.length === 0) {
            res.status(404).json({ error: "Service provider not found" });
        } else {
            res.json(serviceProvider[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching service provider" });
    }
});

// Endpoint to update a service provider by ID
app.put("/service-providers/:id", async (req, res) => {
    const serviceProviderId = req.params.id;
    const { name, service_industry, company_name, phone_number, password } = req.body;
    try {
        const updatedServiceProvider = await db.query(
            "UPDATE service_providers SET name = $1, service_industry = $2, company_name = $3, phone_number = $4, password = $5 WHERE id = $6 RETURNING *",
            [name, service_industry, company_name, phone_number, password, serviceProviderId]
        );
        if (updatedServiceProvider.length === 0) {
            res.status(404).json({ error: "Service provider not found" });
        } else {
            res.json(updatedServiceProvider[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating service provider" });
    }
})

// Endpoint to delete a service provider by ID
app.delete("/service-providers/:id", async (req, res) => {
    const serviceProviderId = req.params.id;
    try {
        const deletedServiceProvider = await db.query("DELETE FROM service_providers WHERE id = $1 RETURNING *", [serviceProviderId]);
        if (deletedServiceProvider.length === 0) {
            res.status(404).json({ error: "Service provider not found" });
        } else {
            res.json(deletedServiceProvider[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error deleting service provider" });
    }
})

//Stationary_shop_details
// Endpoint to add a new stationary shop
app.post('/stationary-shops', async (req, res) => {
    const { shop_name, owner_name, address, contact_number, email } = req.body;
  try {
    const newShop = await db.one(
      "INSERT INTO stationary_shops (shop_name, owner_name, address, contact_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [shop_name, owner_name, address, contact_number, email]
    );
    res.json(newShop);
  } catch (error) {
    console.error('Error adding shop:', error.message);
    res.status(500).json({ error: "Error adding shop" });
  }
});

// Endpoint to get all stationary shops
app.get('/stationary-shops', async (req, res) => {
    try {
        const allStationaryShops = await db.query('SELECT * FROM stationary_shops');
        res.json(allStationaryShops);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stationary shops' });
    }
});

// Endpoint to get a specific stationary shop by ID
app.get('/stationary-shops/:id', async (req, res) => {
    const shopId = req.params.id;
    try {
        const stationaryShop = await db.query('SELECT * FROM stationary_shops WHERE shop_id = $1', [shopId]);
        if (stationaryShop.length === 0) {
            res.status(404).json({ error: 'Stationary shop not found' });
        } else {
            res.json(stationaryShop[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stationary shop' });
    }
});

// Endpoint to update a stationary shop by ID
app.put('/stationary-shops/:id', async (req, res) => {
    const shopId = req.params.id;
    const { shop_name, owner_name, address, phone_number, email } = req.body;
    try {
        const updatedStationaryShop = await db.query(
            'UPDATE stationary_shops SET shop_name = $1, owner_name = $2, address = $3, phone_number = $4, email = $5 WHERE shop_id = $6 RETURNING *',
            [shop_name, owner_name, address, phone_number, email, shopId]
        );
        if (updatedStationaryShop.length === 0) {
            res.status(404).json({ error: 'Stationary shop not found' });
        } else {
            res.json(updatedStationaryShop[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating stationary shop' });
    }
});

// Endpoint to delete a stationary shop by ID
app.delete('/stationary-shops/:id', async (req, res) => {
    const shopId = req.params.id;
    try {
        const deletedStationaryShop = await db.query('DELETE FROM stationary_shops WHERE shop_id = $1 RETURNING *', [shopId]);
        if (deletedStationaryShop.length === 0) {
            res.status(404).json({ error: 'Stationary shop not found' });
        } else {
            res.json(deletedStationaryShop[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting stationary shop' });
    }
});
// Endpoint to add a new stationary item
app.post('/stationary-items', async (req, res) => {
    const { shop_id, item_name, quantity, cost_price, sale_price, description } = req.body;
    const query = 'INSERT INTO inventory_items (shop_id, item_name, quantity, cost_price, sale_price, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [shop_id, item_name, quantity, cost_price, sale_price, description];

    try {
        console.log('Executing query:', query, 'with values:', values); // Log SQL query and parameters
        const newStationaryItem = await db.one(query, values);
        res.json(newStationaryItem);
    } catch (error) {
        console.error('Error adding inventory item:', error.message); // Log detailed error message
        res.status(500).json({ error: 'Error adding inventory item' });
    }
});



// Endpoint to get all stationary items
app.get('/stationary-items', async (req, res) => {
    try {
        const allStationaryItems = await db.query('SELECT * FROM inventory_items');
        res.json(allStationaryItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stationary items' });
    }
});

// Endpoint to get a specific stationary item by ID
app.get('/stationary-items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const stationaryItem = await db.query('SELECT * FROM inventory_items WHERE item_id = $1', [itemId]);
        if (stationaryItem.length === 0) {
            res.status(404).json({ error: 'Stationary item not found' });
        } else {
            res.json(stationaryItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stationary item' });
    }
});

// Endpoint to update a stationary item by ID
app.put('/stationary-items/:id', async (req, res) => {
    const itemId = req.params.id;
    const { shop_id, item_name, quantity, cost_price, sale_price, description } = req.body;
    try {
        const updatedStationaryItem = await db.query(
            'UPDATE inventory_items SET shop_id = $1, item_name = $2, quantity = $3, cost_price = $4, sale_price = $5, description = $6 WHERE item_id = $7 RETURNING *',
            [shop_id, item_name, quantity, cost_price, sale_price, description, itemId]
        );
        if (updatedStationaryItem.length === 0) {
            res.status(404).json({ error: 'Stationary item not found' });
        } else {
            res.json(updatedStationaryItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating stationary item' });
    }
});

// Endpoint to delete a stationary item by ID
app.delete('/stationary-items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const deletedStationaryItem = await db.query('DELETE FROM inventory_items WHERE item_id = $1 RETURNING *', [itemId]);
        if (deletedStationaryItem.length === 0) {
            res.status(404).json({ error: 'Stationary item not found' });
        } else {
            res.json(deletedStationaryItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting stationary item' });
    }
});

// Endpoint to add a new stationary cart item
app.post('/stat-cart-items', async (req, res) => {
    const { consumer_id, stationary_item_id, quantity, special_instruction } = req.body;
    try {
        const newCartItem = await db.query(
            'INSERT INTO stat_cart (consumer_id, stationary_item_id, quantity, special_instruction) VALUES ($1, $2, $3, $4) RETURNING *',
            [consumer_id, stationary_item_id, quantity, special_instruction]
        );
        res.json(newCartItem);
    } catch (error) {
        console.error('error is -',error.message)
        res.status(500).json({ error: 'Error adding cart item' });
    }
});

// Endpoint to get all stationary cart items
app.get('/stat-cart-items', async (req, res) => {
    try {
        const allCartItems = await db.query('SELECT * FROM stat_cart');
        res.json(allCartItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart items' });
    }
});

// Endpoint to get a specific stationary cart item by ID
app.get('/stat-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    try {
        const cartItem = await db.query('SELECT * FROM stat_cart WHERE id = $1', [cartItemId]);
        if (cartItem.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(cartItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart item' });
    }
});

// Endpoint to update a stationary cart item by ID
app.put('/stat-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    const { consumer_id, stationary_item_id, quantity, special_instruction } = req.body;
    try {
        const updatedCartItem = await db.query(
            'UPDATE stat_cart SET consumer_id = $1, stationary_item_id = $2, quantity = $3, special_instruction = $4 WHERE id = $5 RETURNING *',
            [consumer_id, stationary_item_id, quantity, special_instruction, cartItemId]
        );
        if (updatedCartItem.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(updatedCartItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart item' });
    }
});

// Endpoint to delete a stationary cart item by ID
app.delete('/stat-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    try {
        const deletedCartItem = await db.query('DELETE FROM stat_cart WHERE id = $1 RETURNING *', [cartItemId]);
        if (deletedCartItem.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(deletedCartItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart item' });
    }
});

//stationary_item_order_details
// Endpoint to add a new stationary order item
app.post('/order-items', async (req, res) => {
    const { user_id, item_id, quantity } = req.body;
    try {
        const newOrderItem = await db.query(
            'INSERT INTO stat_orders (user_id, item_id, quantity, purchase_date) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [user_id, item_id, quantity]
        );
        res.json(newOrderItem);
    } catch (error) {
        console.error("error -",error.message)
        res.status(500).json({ error: 'Error adding order item' });
    }
});

// Endpoint to get all order items
app.get('/order-items', async (req, res) => {
    try {
        const allOrderItems = await db.query('SELECT * FROM stat_orders');
        res.json(allOrderItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order items' });
    }
});

// Endpoint to get a specific order item by purchase_id
app.get('/order-items/:id', async (req, res) => {
    const purchaseId = req.params.id;
    try {
        const orderItem = await db.query('SELECT * FROM stat_orders WHERE purchase_id = $1', [purchaseId]);
        if (orderItem.length === 0) {
            res.status(404).json({ error: 'Order item not found' });
        } else {
            res.json(orderItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order item' });
    }
});

// Endpoint to update an order item by purchase_id
app.put('/order-items/:id', async (req, res) => {
    const purchaseId = req.params.id;
    const { user_id, item_id, quantity } = req.body;
    try {
        const updatedOrderItem = await db.query(
            'UPDATE stat_orders SET user_id = $1, item_id = $2, quantity = $3 WHERE purchase_id = $4 RETURNING *',
            [user_id, item_id, quantity, purchaseId]
        );
        if (updatedOrderItem.length === 0) {
            res.status(404).json({ error: 'Order item not found' });
        } else {
            res.json(updatedOrderItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating order item' });
    }
});

// Endpoint to delete an order item by purchase_id
app.delete('/order-items/:id', async (req, res) => {
    const purchaseId = req.params.id;
    try {
        await db.query('DELETE FROM stat_orders WHERE purchase_id = $1', [purchaseId]);
        res.json({ message: 'Order item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order item' });
    }
});

// Endpoint to add a new order tracking entry
app.post('/order-tracking', async (req, res) => {
    const { order_id, current_location, estimated_arrival } = req.body;
    try {
        const newOrderTracking = await db.query(
            'INSERT INTO order_tracking (order_id, current_location, estimated_arrival) VALUES ($1, $2, $3) RETURNING *',
            [order_id, current_location, estimated_arrival]
        );
        res.json(newOrderTracking);
    } catch (error) {
        console.error("error -",error.message)
        res.status(500).json({ error: 'Error adding order tracking entry' });
    }
});

// Endpoint to get all order tracking entries
app.get('/order-tracking', async (req, res) => {
    try {
        const allOrderTracking = await db.query('SELECT * FROM order_tracking');
        res.json(allOrderTracking);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order tracking entries' });
    }
});

// Endpoint to get a specific order tracking entry by ID
app.get('/order-tracking/:id', async (req, res) => {
    const trackingId = req.params.id;
    try {
        const orderTracking = await db.query('SELECT * FROM order_tracking WHERE id = $1', [trackingId]);
        if (orderTracking.length === 0) {
            res.status(404).json({ error: 'Order tracking entry not found' });
        } else {
            res.json(orderTracking);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order tracking entry' });
    }
});

// Endpoint to update an order tracking entry by ID
app.put('/order-tracking/:id', async (req, res) => {
    const trackingId = req.params.id;
    const { order_id, current_location, estimated_arrival } = req.body;
    try {
        const updatedOrderTracking = await db.query(
            'UPDATE order_tracking SET order_id = $1, current_location = $2, estimated_arrival = $3 WHERE id = $4 RETURNING *',
            [order_id, current_location, estimated_arrival, trackingId]
        );
        if (updatedOrderTracking.length === 0) {
            res.status(404).json({ error: 'Order tracking entry not found' });
        } else {
            res.json(updatedOrderTracking);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating order tracking entry' });
    }
});

// Endpoint to delete an order tracking entry by ID
app.delete('/order-tracking/:id', async (req, res) => {
    const trackingId = req.params.id;
    try {
        await db.query('DELETE FROM order_tracking WHERE id = $1', [trackingId]);
        res.json({ message: 'Order tracking entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order tracking entry' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// const db = require('pg-promise')();
// const connection = {
//     host: 'localhost',
//     port: 5432, // PostgreSQL default port
//     database: 'intel',
//     user: 'newuser',
//     password: 'newintel',
// };


// const db = new pg.Client({
//   user: "newuser",
//   host: "localhost",
//   database: "intel",
//   password: "newintel",
//   port: 5432
// });

// Endpoint to get all users
// app.get("/users", async (req, res) => {
//   try {
//     const allUsers = await db.query("SELECT * FROM consumers");
//     res.json(allUsers.rows);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// Endpoint to get a specific user by ID

// // Endpoint to add a new restaurant
// app.post("/restaurants", async (req, res) => {
//     const { shop_name, owner_name, address, phone_number, email } = req.body;
//     try {
//         const newRestaurant = await db.query(
//             "INSERT INTO restaurant_name (shop_name, owner_name, address, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//             [shop_name, owner_name, address, phone_number, email]
//         );
//         res.json(newRestaurant[0]);
//     } catch (error) {
//         res.status(500).json({ error: "Error adding restaurant" });
//     }
// });

// // Endpoint to get all restaurants
// app.get("/restaurants", async (req, res) => {
//     try {
//         const allRestaurants = await db.query("SELECT * FROM restaurant_name");
//         res.json(allRestaurants);
//     } catch (error) {
//         res.status(500).json({ error: "Error fetching restaurants" });
//     }
// });

// // Endpoint to get a specific restaurant by ID
// app.get("/restaurants/:id", async (req, res) => {
//     const restaurantId = req.params.id;
//     try {
//         const restaurant = await db.query("SELECT * FROM restaurant_name WHERE shop_id = $1", [restaurantId]);
//         if (restaurant.length === 0) {
//             res.status(404).json({ error: "Restaurant not found" });
//         } else {
//             res.json(restaurant[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Error fetching restaurant" });
//     }
// });

// // Endpoint to update a restaurant by ID
// app.put("/restaurants/:id", async (req, res) => {
//     const restaurantId = req.params.id;
//     const { shop_name, owner_name, address, phone_number, email } = req.body;
//     try {
//         const updatedRestaurant = await db.query(
//             "UPDATE restaurant_name SET shop_name = $1, owner_name = $2, address = $3, phone_number = $4, email = $5 WHERE shop_id = $6 RETURNING *",
//             [shop_name, owner_name, address, phone_number, email, restaurantId]
//         );
//         if (updatedRestaurant.length === 0) {
//             res.status(404).json({ error: "Restaurant not found" });
//         } else {
//             res.json(updatedRestaurant[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Error updating restaurant" });
//     }
// });

// // Endpoint to delete a restaurant by ID
// app.delete("/restaurants/:id", async (req, res) => {
//     const restaurantId = req.params.id;
//     try {
//         const deletedRestaurant = await db.query("DELETE FROM restaurant_name WHERE shop_id = $1 RETURNING *", [restaurantId]);
//         if (deletedRestaurant.length === 0) {
//             res.status(404).json({ error: "Restaurant not found" });
//         } else {
//             res.json(deletedRestaurant[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Error deleting restaurant" });
//     }
// });



// // Endpoint to add a new menu item
// app.post('/menu-items', async (req, res) => {
//     const { restaurant, menu_item, location, phone_number, price, rating } = req.body;
//     try {
//         const newMenuItem = await db.query(
//             'INSERT INTO food_menu (restaurant, menu_item, location, phone_number, price, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//             [restaurant, menu_item, location, phone_number, price, rating]
//         );
//         res.json(newMenuItem[0]);
//     } catch (error) {
//         res.status(500).json({ error: 'Error adding menu item' });
//     }
// });
// // Endpoint to get all menu items
// app.get('/menu-items', async (req, res) => {
//     try {
//         const allMenuItems = await db.query('SELECT * FROM food_menu');
//         res.json(allMenuItems);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching menu items' });
//     }
// });

// // Endpoint to get a specific menu item by ID
// app.get('/menu-items/:id', async (req, res) => {
//     const menuItemId = req.params.id;
//     try {
//         const menuItem = await db.query('SELECT * FROM food_menu WHERE id = $1', [menuItemId]);
//         if (menuItem.length === 0) {
//             res.status(404).json({ error: 'Menu item not found' });
//         } else {
//             res.json(menuItem[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching menu item' });
//     }
// });

// // Endpoint to update a menu item by ID
// app.put('/menu-items/:id', async (req, res) => {
//     const menuItemId = req.params.id;
//     const { restaurant, menu_item, location, phone_number, price, rating } = req.body;
//     try {
//         const updatedMenuItem = await db.query(
//             'UPDATE food_menu SET restaurant = $1, menu_item = $2, location = $3, phone_number = $4, price = $5, rating = $6 WHERE id = $7 RETURNING *',
//             [restaurant, menu_item, location, phone_number, price, rating, menuItemId]
//         );
//         if (updatedMenuItem.length === 0) {
//             res.status(404).json({ error: 'Menu item not found' });
//         } else {
//             res.json(updatedMenuItem[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating menu item' });
//     }
// });

// // Endpoint to delete a menu item by ID
// app.delete('/menu-items/:id', async (req, res) => {
//     const menuItemId = req.params.id;
//     try {
//         const deletedMenuItem = await db.query('DELETE FROM food_menu WHERE id = $1 RETURNING *', [menuItemId]);
//         if (deletedMenuItem.length === 0) {
//             res.status(404).json({ error: 'Menu item not found' });
//         } else {
//             res.json(deletedMenuItem[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting menu item' });
//     }
// });

// // Endpoint to add a new restaurant cart item
// app.post('/res-cart-items', async (req, res) => {
//     const { consumer_id, item_id, quantity, special_instruction } = req.body;
//     try {
//         const newCartItem = await db.query(
//             'INSERT INTO cart (consumer_id, item_id, quantity, special_instruction) VALUES ($1, $2, $3, $4) RETURNING *',
//             [consumer_id, item_id, quantity, special_instruction]
//         );
//         res.json(newCartItem[0]);
//     } catch (error) {
//         res.status(500).json({ error: 'Error adding cart item' });
//     }
// });

// // Endpoint to get all cart items
// app.get('/res-cart-items', async (req, res) => {
//     try {
//         const allCartItems = await db.query('SELECT * FROM cart');
//         res.json(allCartItems);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching cart items' });
//     }
// });

// // Endpoint to get a specific cart item by ID
// app.get('/res-cart-items/:id', async (req, res) => {
//     const cartItemId = req.params.id;
//     try {
//         const cartItem = await db.query('SELECT * FROM cart WHERE id = $1', [cartItemId]);
//         if (cartItem.length === 0) {
//             res.status(404).json({ error: 'Cart item not found' });
//         } else {
//             res.json(cartItem[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching cart item' });
//     }
// });

// // Endpoint to update a cart item by ID
// app.put('/res-cart-items/:id', async (req, res) => {
//     const cartItemId = req.params.id;
//     const { consumer_id, item_id, quantity, special_instruction } = req.body;
//     try {
//         const updatedCartItem = await db.query(
//             'UPDATE cart SET consumer_id = $1, item_id = $2, quantity = $3, special_instruction = $4 WHERE id = $5 RETURNING *',
//             [consumer_id, item_id, quantity, special_instruction, cartItemId]
//         );
//         if (updatedCartItem.length === 0) {
//             res.status(404).json({ error: 'Cart item not found' });
//         } else {
//             res.json(updatedCartItem[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating cart item' });
//     }
// });

// // Endpoint to delete a cart item by ID
// app.delete('/res-cart-items/:id', async (req, res) => {
//     const cartItemId = req.params.id;
//     try {
//         const deletedCartItem = await db.query('DELETE FROM cart WHERE id = $1 RETURNING *', [cartItemId]);
//         if (deletedCartItem.length === 0) {
//             res.status(404).json({ error: 'Cart item not found' });
//         } else {
//             res.json(deletedCartItem[0]);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting cart item' });
//     }
// });

// //All_orders_details
// // Endpoint to add a new order
// app.post('/res-orders', async (req, res) => {
//     const { consumer_id, total_price, status } = req.body;
//     try {
//         const newOrder = await db.query(
//             'INSERT INTO orders (consumer_id, total_price, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
//             [consumer_id, total_price, status]
//         );
//         res.json(newOrder);
//     } catch (error) {
//         res.status(500).json({ error: 'Error adding order' });
//     }
// });

// // Endpoint to get all orders
// app.get('/res-orders', async (req, res) => {
//     try {
//         const allOrders = await db.query('SELECT * FROM orders');
//         res.json(allOrders);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching orders' });
//     }
// });

// // Endpoint to get a specific order by ID
// app.get('/res-orders/:id', async (req, res) => {
//     const orderId = req.params.id;
//     try {
//         const order = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
//         if (order.length === 0) {
//             res.status(404).json({ error: 'Order not found' });
//         } else {
//             res.json(order);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching order' });
//     }
// });

// // Endpoint to update an order by ID
// app.put('/res-orders/:id', async (req, res) => {
//     const orderId = req.params.id;
//     const { consumer_id, total_price, status } = req.body;
//     try {
//         const updatedOrder = await db.query(
//             'UPDATE orders SET consumer_id = $1, total_price = $2, status = $3 WHERE id = $4 RETURNING *',
//             [consumer_id, total_price, status, orderId]
//         );
//         if (updatedOrder.length === 0) {
//             res.status(404).json({ error: 'Order not found' });
//         } else {
//             res.json(updatedOrder);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating order' });
//     }
// });
// // Endpoint to delete an order by ID
// app.delete('/res-orders/:id', async (req, res) => {
//     const orderId = req.params.id;
//     try {
//         await db.query('DELETE FROM orders WHERE id = $1', [orderId]);
//         res.json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting order' });
//     }
// });