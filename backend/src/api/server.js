if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { createApp } = require('./app');

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SGIM Backend corriendo en http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});