const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
    user: 'newuser',
    host: 'localhost',
    database: 'intel',
    password: 'newintel',
    port: 5432,
});

//consumer_details
// Endpoint to add a new user
app.post('/users', async (req, res) => {
    const { name, username, password, phonenumber, dateofbirth } = req.body;
    try {
        const newUser = await pool.query(
            'INSERT INTO users (name, username, password, phonenumber, dateofbirth) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, username, password, phonenumber, dateofbirth]
        );
        res.json(newUser.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding user' });
    }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Endpoint to get a specific user by ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Endpoint to update a user by ID
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, username, password, phonenumber, dateofbirth } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE users SET name = $1, username = $2, password = $3, phonenumber = $4, dateofbirth = $5 WHERE id = $6 RETURNING *',
            [name, username, password, phonenumber, dateofbirth, userId]
        );
        if (updatedUser.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(updatedUser.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Endpoint to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (deletedUser.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(deletedUser.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});


//Service-providers-details
// Endpoint to add a new service provider
app.post('/service-providers', async (req, res) => {
    const { name, service_industry, company_name, phone_number, password } = req.body;
    try {
        const newServiceProvider = await pool.query(
            'INSERT INTO service_providers (name, service_industry, company_name, phone_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, service_industry, company_name, phone_number, password]
        );
        res.json(newServiceProvider.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding service provider' });
    }
});

// Endpoint to get all service providers
app.get('/service-providers', async (req, res) => {
    try {
        const allServiceProviders = await pool.query('SELECT * FROM service_providers');
        res.json(allServiceProviders.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching service providers' });
    }
});

// Endpoint to get a specific service provider by ID
app.get('/service-providers/:id', async (req, res) => {
    const serviceProviderId = req.params.id;
    try {
        const serviceProvider = await pool.query('SELECT * FROM service_providers WHERE id = $1', [serviceProviderId]);
        if (serviceProvider.rows.length === 0) {
            res.status(404).json({ error: 'Service provider not found' });
        } else {
            res.json(serviceProvider.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching service provider' });
    }
});

// Endpoint to update a service provider by ID
app.put('/service-providers/:id', async (req, res) => {
    const serviceProviderId = req.params.id;
    const { name, service_industry, company_name, phone_number, password } = req.body;
    try {
        const updatedServiceProvider = await pool.query(
            'UPDATE service_providers SET name = $1, service_industry = $2, company_name = $3, phone_number = $4, password = $5 WHERE id = $6 RETURNING *',
            [name, service_industry, company_name, phone_number, password, serviceProviderId]
        );
        if (updatedServiceProvider.rows.length === 0) {
            res.status(404).json({ error: 'Service provider not found' });
        } else {
            res.json(updatedServiceProvider.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating service provider' });
    }
});

// Endpoint to delete a service provider by ID
app.delete('/service-providers/:id', async (req, res) => {
    const serviceProviderId = req.params.id;
    try {
        const deletedServiceProvider = await pool.query('DELETE FROM service_providers WHERE id = $1 RETURNING *', [serviceProviderId]);
        if (deletedServiceProvider.rows.length === 0) {
            res.status(404).json({ error: 'Service provider not found' });
        } else {
            res.json(deletedServiceProvider.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting service provider' });
    }
});


//restaurant_all_details
// Endpoint to add a new restaurant
app.post('/restaurants', async (req, res) => {
    const { shop_name, owner_name, address, phone_number, email } = req.body;
    try {
        const newRestaurant = await pool.query(
            'INSERT INTO restaurants (shop_name, owner_name, address, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [shop_name, owner_name, address, phone_number, email]
        );
        res.json(newRestaurant.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding restaurant' });
    }
});

// Endpoint to get all restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const allRestaurants = await pool.query('SELECT * FROM restaurants');
        res.json(allRestaurants.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching restaurants' });
    }
});

// Endpoint to get a specific restaurant by ID
app.get('/restaurants/:id', async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await pool.query('SELECT * FROM restaurants WHERE shop_id = $1', [restaurantId]);
        if (restaurant.rows.length === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json(restaurant.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching restaurant' });
    }
});

// Endpoint to update a restaurant by ID
app.put('/restaurants/:id', async (req, res) => {
    const restaurantId = req.params.id;
    const { shop_name, owner_name, address, phone_number, email } = req.body;
    try {
        const updatedRestaurant = await pool.query(
            'UPDATE restaurants SET shop_name = $1, owner_name = $2, address = $3, phone_number = $4, email = $5 WHERE shop_id = $6 RETURNING *',
            [shop_name, owner_name, address, phone_number, email, restaurantId]
        );
        if (updatedRestaurant.rows.length === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json(updatedRestaurant.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating restaurant' });
    }
});

// Endpoint to delete a restaurant by ID
app.delete('/restaurants/:id', async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const deletedRestaurant = await pool.query('DELETE FROM restaurants WHERE shop_id = $1 RETURNING *', [restaurantId]);
        if (deletedRestaurant.rows.length === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json(deletedRestaurant.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting restaurant' });
    }
});

// Endpoint to add a new menu item
app.post('/menu-items', async (req, res) => {
    const { restaurant, menu_item, location, phone_number, price, rating } = req.body;
    try {
        const newMenuItem = await pool.query(
            'INSERT INTO food_menu (restaurant, menu_item, location, phone_number, price, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [restaurant, menu_item, location, phone_number, price, rating]
        );
        res.json(newMenuItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding menu item' });
    }
});

// Endpoint to get all menu items
app.get('/menu-items', async (req, res) => {
    try {
        const allMenuItems = await pool.query('SELECT * FROM food_menu');
        res.json(allMenuItems.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// Endpoint to get a specific menu item by ID
app.get('/menu-items/:id', async (req, res) => {
    const menuItemId = req.params.id;
    try {
        const menuItem = await pool.query('SELECT * FROM food_menu WHERE id = $1', [menuItemId]);
        if (menuItem.rows.length === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json(menuItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching menu item' });
    }
});

// Endpoint to update a menu item by ID
app.put('/menu-items/:id', async (req, res) => {
    const menuItemId = req.params.id;
    const { restaurant, menu_item, location, phone_number, price, rating } = req.body;
    try {
        const updatedMenuItem = await pool.query(
            'UPDATE food_menu SET restaurant = $1, menu_item = $2, location = $3, phone_number = $4, price = $5, rating = $6 WHERE id = $7 RETURNING *',
            [restaurant, menu_item, location, phone_number, price, rating, menuItemId]
        );
        if (updatedMenuItem.rows.length === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json(updatedMenuItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating menu item' });
    }
});

// Endpoint to delete a menu item by ID
app.delete('/menu-items/:id', async (req, res) => {
    const menuItemId = req.params.id;
    try {
        const deletedMenuItem = await pool.query('DELETE FROM food_menu WHERE id = $1 RETURNING *', [menuItemId]);
        if (deletedMenuItem.rows.length === 0) {
            res.status(404).json({ error: 'Menu item not found' });
        } else {
            res.json(deletedMenuItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting menu item' });
    }
});

// Endpoint to add a new restaurant cart item
app.post('/res-cart-items', async (req, res) => {
    const { consumer_id, item_id, quantity, special_instruction } = req.body;
    try {
        const newCartItem = await pool.query(
            'INSERT INTO cart (consumer_id, item_id, quantity, special_instruction) VALUES ($1, $2, $3, $4) RETURNING *',
            [consumer_id, item_id, quantity, special_instruction]
        );
        res.json(newCartItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding cart item' });
    }
});

// Endpoint to get all cart items
app.get('/res-cart-items', async (req, res) => {
    try {
        const allCartItems = await pool.query('SELECT * FROM cart');
        res.json(allCartItems.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart items' });
    }
});

// Endpoint to get a specific cart item by ID
app.get('/res-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    try {
        const cartItem = await pool.query('SELECT * FROM cart WHERE id = $1', [cartItemId]);
        if (cartItem.rows.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(cartItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart item' });
    }
});

// Endpoint to update a cart item by ID
app.put('/res-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    const { consumer_id, item_id, quantity, special_instruction } = req.body;
    try {
        const updatedCartItem = await pool.query(
            'UPDATE cart SET consumer_id = $1, item_id = $2, quantity = $3, special_instruction = $4 WHERE id = $5 RETURNING *',
            [consumer_id, item_id, quantity, special_instruction, cartItemId]
        );
        if (updatedCartItem.rows.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(updatedCartItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart item' });
    }
});

// Endpoint to delete a cart item by ID
app.delete('/res-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    try {
        const deletedCartItem = await pool.query('DELETE FROM cart WHERE id = $1 RETURNING *', [cartItemId]);
        if (deletedCartItem.rows.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(deletedCartItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart item' });
    }
});


//Stationary_shop_details
// Endpoint to add a new stationary shop
app.post('/stationary-shops', async (req, res) => {
    const { shop_name, owner_name, address, phone_number, email } = req.body;
    try {
        const newStationaryShop = await pool.query(
            'INSERT INTO stationary_shops (shop_name, owner_name, address, phone_number, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [shop_name, owner_name, address, phone_number, email]
        );
        res.json(newStationaryShop.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding stationary shop' });
    }
});

// Endpoint to get all stationary shops
app.get('/stationary-shops', async (req, res) => {
    try {
        const allStationaryShops = await pool.query('SELECT * FROM stationary_shops');
        res.json(allStationaryShops.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stationary shops' });
    }
});

// Endpoint to get a specific stationary shop by ID
app.get('/stationary-shops/:id', async (req, res) => {
    const shopId = req.params.id;
    try {
        const stationaryShop = await pool.query('SELECT * FROM stationary_shops WHERE shop_id = $1', [shopId]);
        if (stationaryShop.rows.length === 0) {
            res.status(404).json({ error: 'Stationary shop not found' });
        } else {
            res.json(stationaryShop.rows[0]);
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
        const updatedStationaryShop = await pool.query(
            'UPDATE stationary_shops SET shop_name = $1, owner_name = $2, address = $3, phone_number = $4, email = $5 WHERE shop_id = $6 RETURNING *',
            [shop_name, owner_name, address, phone_number, email, shopId]
        );
        if (updatedStationaryShop.rows.length === 0) {
            res.status(404).json({ error: 'Stationary shop not found' });
        } else {
            res.json(updatedStationaryShop.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating stationary shop' });
    }
});

// Endpoint to delete a stationary shop by ID
app.delete('/stationary-shops/:id', async (req, res) => {
    const shopId = req.params.id;
    try {
        const deletedStationaryShop = await pool.query('DELETE FROM stationary_shops WHERE shop_id = $1 RETURNING *', [shopId]);
        if (deletedStationaryShop.rows.length === 0) {
            res.status(404).json({ error: 'Stationary shop not found' });
        } else {
            res.json(deletedStationaryShop.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting stationary shop' });
    }
});

// Endpoint to add a new stationary item
app.post('/stationary-items', async (req, res) => {
    const { shop_id, item_name, quantity, cost_price, sale_price, description } = req.body;
    try {
        const newStationaryItem = await pool.query(
            'INSERT INTO stationary_items (shop_id, item_name, quantity, cost_price, sale_price, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [shop_id, item_name, quantity, cost_price, sale_price, description]
        );
        res.json(newStationaryItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding stationary item' });
    }
});

// Endpoint to get all stationary items
app.get('/stationary-items', async (req, res) => {
    try {
        const allStationaryItems = await pool.query('SELECT * FROM stationary_items');
        res.json(allStationaryItems.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stationary items' });
    }
});

// Endpoint to get a specific stationary item by ID
app.get('/stationary-items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const stationaryItem = await pool.query('SELECT * FROM stationary_items WHERE item_id = $1', [itemId]);
        if (stationaryItem.rows.length === 0) {
            res.status(404).json({ error: 'Stationary item not found' });
        } else {
            res.json(stationaryItem.rows[0]);
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
        const updatedStationaryItem = await pool.query(
            'UPDATE stationary_items SET shop_id = $1, item_name = $2, quantity = $3, cost_price = $4, sale_price = $5, description = $6 WHERE item_id = $7 RETURNING *',
            [shop_id, item_name, quantity, cost_price, sale_price, description, itemId]
        );
        if (updatedStationaryItem.rows.length === 0) {
            res.status(404).json({ error: 'Stationary item not found' });
        } else {
            res.json(updatedStationaryItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating stationary item' });
    }
});

// Endpoint to delete a stationary item by ID
app.delete('/stationary-items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const deletedStationaryItem = await pool.query('DELETE FROM stationary_items WHERE item_id = $1 RETURNING *', [itemId]);
        if (deletedStationaryItem.rows.length === 0) {
            res.status(404).json({ error: 'Stationary item not found' });
        } else {
            res.json(deletedStationaryItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting stationary item' });
    }
});

// Endpoint to add a new stationary cart item
app.post('/stat-cart-items', async (req, res) => {
    const { consumer_id, stationary_item_id, quantity, special_instruction } = req.body;
    try {
        const newCartItem = await pool.query(
            'INSERT INTO cart (consumer_id, stationary_item_id, quantity, special_instruction) VALUES ($1, $2, $3, $4) RETURNING *',
            [consumer_id, stationary_item_id, quantity, special_instruction]
        );
        res.json(newCartItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding cart item' });
    }
});

// Endpoint to get all stationary cart items
app.get('/stat-cart-items', async (req, res) => {
    try {
        const allCartItems = await pool.query('SELECT * FROM cart');
        res.json(allCartItems.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart items' });
    }
});

// Endpoint to get a specific stationary cart item by ID
app.get('/stat-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    try {
        const cartItem = await pool.query('SELECT * FROM cart WHERE id = $1', [cartItemId]);
        if (cartItem.rows.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(cartItem.rows[0]);
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
        const updatedCartItem = await pool.query(
            'UPDATE cart SET consumer_id = $1, stationary_item_id = $2, quantity = $3, special_instruction = $4 WHERE id = $5 RETURNING *',
            [consumer_id, stationary_item_id, quantity, special_instruction, cartItemId]
        );
        if (updatedCartItem.rows.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(updatedCartItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart item' });
    }
});

// Endpoint to delete a stationary cart item by ID
app.delete('/stat-cart-items/:id', async (req, res) => {
    const cartItemId = req.params.id;
    try {
        const deletedCartItem = await pool.query('DELETE FROM cart WHERE id = $1 RETURNING *', [cartItemId]);
        if (deletedCartItem.rows.length === 0) {
            res.status(404).json({ error: 'Cart item not found' });
        } else {
            res.json(deletedCartItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart item' });
    }
});


//All_orders_details
// Endpoint to add a new order
app.post('/res-orders', async (req, res) => {
    const { consumer_id, total_price, status } = req.body;
    try {
        const newOrder = await pool.query(
            'INSERT INTO orders (consumer_id, total_price, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [consumer_id, total_price, status]
        );
        res.json(newOrder.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding order' });
    }
});

// Endpoint to get all orders
app.get('/res-orders', async (req, res) => {
    try {
        const allOrders = await pool.query('SELECT * FROM orders');
        res.json(allOrders.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Endpoint to get a specific order by ID
app.get('/res-orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (order.rows.length === 0) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(order.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
});

// Endpoint to update an order by ID
app.put('/res-orders/:id', async (req, res) => {
    const orderId = req.params.id;
    const { consumer_id, total_price, status } = req.body;
    try {
        const updatedOrder = await pool.query(
            'UPDATE orders SET consumer_id = $1, total_price = $2, status = $3 WHERE id = $4 RETURNING *',
            [consumer_id, total_price, status, orderId]
        );
        if (updatedOrder.rows.length === 0) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(updatedOrder.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating order' });
    }
});

// Endpoint to delete an order by ID
app.delete('/res-orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const deletedOrder = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [orderId]);
        if (deletedOrder.rows.length === 0) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(deletedOrder.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
});


//stationary_item_order_details
// Endpoint to add a new stationary order item
app.post('/order-items', async (req, res) => {
    const { user_id, item_id, quantity } = req.body;
    try {
        const newOrderItem = await pool.query(
            'INSERT INTO stat_order (user_id, item_id, quantity, purchase_date) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [user_id, item_id, quantity]
        );
        res.json(newOrderItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding order item' });
    }
});

// Endpoint to get all order items
app.get('/order-items', async (req, res) => {
    try {
        const allOrderItems = await pool.query('SELECT * FROM stat_order');
        res.json(allOrderItems.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order items' });
    }
});

// Endpoint to get a specific order item by purchase_id
app.get('/order-items/:id', async (req, res) => {
    const purchaseId = req.params.id;
    try {
        const orderItem = await pool.query('SELECT * FROM stat_order WHERE purchase_id = $1', [purchaseId]);
        if (orderItem.rows.length === 0) {
            res.status(404).json({ error: 'Order item not found' });
        } else {
            res.json(orderItem.rows[0]);
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
        const updatedOrderItem = await pool.query(
            'UPDATE stat_order SET user_id = $1, item_id = $2, quantity = $3 WHERE purchase_id = $4 RETURNING *',
            [user_id, item_id, quantity, purchaseId]
        );
        if (updatedOrderItem.rows.length === 0) {
            res.status(404).json({ error: 'Order item not found' });
        } else {
            res.json(updatedOrderItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating order item' });
    }
});

// Endpoint to delete an order item by purchase_id
app.delete('/order-items/:id', async (req, res) => {
    const purchaseId = req.params.id;
    try {
        const deletedOrderItem = await pool.query('DELETE FROM stat_order WHERE purchase_id = $1 RETURNING *', [purchaseId]);
        if (deletedOrderItem.rows.length === 0) {
            res.status(404).json({ error: 'Order item not found' });
        } else {
            res.json(deletedOrderItem.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order item' });
    }
});

// Endpoint to add a new order tracking entry
app.post('/order-tracking', async (req, res) => {
    const { order_id, current_location, estimated_arrival } = req.body;
    try {
        const newOrderTracking = await pool.query(
            'INSERT INTO order_tracking (order_id, current_location, estimated_arrival) VALUES ($1, $2, $3) RETURNING *',
            [order_id, current_location, estimated_arrival]
        );
        res.json(newOrderTracking.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error adding order tracking entry' });
    }
});

// Endpoint to get all order tracking entries
app.get('/order-tracking', async (req, res) => {
    try {
        const allOrderTracking = await pool.query('SELECT * FROM order_tracking');
        res.json(allOrderTracking.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order tracking entries' });
    }
});

// Endpoint to get a specific order tracking entry by ID
app.get('/order-tracking/:id', async (req, res) => {
    const trackingId = req.params.id;
    try {
        const orderTracking = await pool.query('SELECT * FROM order_tracking WHERE id = $1', [trackingId]);
        if (orderTracking.rows.length === 0) {
            res.status(404).json({ error: 'Order tracking entry not found' });
        } else {
            res.json(orderTracking.rows[0]);
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
        const updatedOrderTracking = await pool.query(
            'UPDATE order_tracking SET order_id = $1, current_location = $2, estimated_arrival = $3 WHERE id = $4 RETURNING *',
            [order_id, current_location, estimated_arrival, trackingId]
        );
        if (updatedOrderTracking.rows.length === 0) {
            res.status(404).json({ error: 'Order tracking entry not found' });
        } else {
            res.json(updatedOrderTracking.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating order tracking entry' });
    }
});

// Endpoint to delete an order tracking entry by ID
app.delete('/order-tracking/:id', async (req, res) => {
    const trackingId = req.params.id;
    try {
        const deletedOrderTracking = await pool.query('DELETE FROM order_tracking WHERE id = $1 RETURNING *', [trackingId]);
        if (deletedOrderTracking.rows.length === 0) {
            res.status(404).json({ error: 'Order tracking entry not found' });
        } else {
            res.json(deletedOrderTracking.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order tracking entry' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
