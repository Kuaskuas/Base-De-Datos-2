const connectDB = require('./config/database');

// Función para probar la conexión
const testConnection = async () => {
  console.log('🔍 Probando conexión a MongoDB...');
  
  try {
    await connectDB();
    console.log('✅ ¡Conexión exitosa!');
    
    // Mostrar información de la base de datos
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    console.log(`📊 Base de datos: ${db.databaseName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`🚪 Puerto: ${mongoose.connection.port}`);
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

testConnection();