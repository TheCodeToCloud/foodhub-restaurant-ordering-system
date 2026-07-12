# uploads/

This directory is reserved for file uploads when using disk-based storage.

Currently, the application uses **Multer's memory storage** and stores images
as Base64-encoded strings directly in the MySQL database.

If you switch to disk storage in the future, uploaded files will be saved here
and served via the static middleware in server.js:

    app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
