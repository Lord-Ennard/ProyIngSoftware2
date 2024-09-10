import HeaderAdmin from '../../COMPONENTES/Header_Admin'; // Asegúrate de importar el Header correcto
import BarraHorizontal from '../../COMPONENTES/BarraHorizontalAdmin'; // Barra de navegación creada previamente
import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button } from '@mui/material';

const AgregarProducto = () => {
    // Manejo de estado para los campos del formulario
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        caracteristicas: '',
        marca: '',
        serie: '',
        precio: '',
        tipo: '',
        stock: '',
    });

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        // Aquí iría la lógica para guardar el producto, como una llamada a la API.
        console.log(producto);
    };

    return(
        <div>
            <HeaderAdmin/>
            <BarraHorizontal/>
            <Box sx={{ mt: 4, mx: 4 }}>

                {/* Sección de Agregar Producto */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center', // Centra el texto horizontalmente
                    alignItems: 'center', // Centra el texto verticalmente
                    backgroundColor: '#D6E9FE', // Fondo color celeste
                    padding: '10px 20px',
                    borderRadius: '8px',
                    mb: 4,
                    height: '50px' // Establece una altura fija si es necesario
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Agregar Producto
                  </Typography>
                </Box>

                {/* Formulario para agregar producto */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper
                          elevation={4}
                          sx={{
                            backgroundColor: '#F5F5F5', // Fondo gris claro
                            padding: 2,
                            height: '100%', // Asegura que el Paper ocupe todo el espacio
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                            {/* Imagen del Producto */}
                            <Button variant="outlined" component="label">
                                Agregar Imagen
                                <input type="file" hidden />
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper
                          elevation={4}
                          sx={{
                            backgroundColor: '#F5F5F5', // Fondo gris claro
                            padding: 4
                          }}
                        >
                            {/* Nombre */}
                            <TextField
                              fullWidth
                              label="Nombre"
                              name="nombre"
                              value={producto.nombre}
                              onChange={handleChange}
                              sx={{ mb: 2 }}
                            />

                            {/* Descripción */}
                            <TextField
                              fullWidth
                              label="Descripción"
                              name="descripcion"
                              value={producto.descripcion}
                              onChange={handleChange}
                              sx={{ mb: 2 }}
                            />

                            {/* Características */}
                            <TextField
                              fullWidth
                              label="Características"
                              name="caracteristicas"
                              value={producto.caracteristicas}
                              onChange={handleChange}
                              multiline
                              rows={3}
                              sx={{ mb: 2 }}
                            />

                            {/* Marca, Serie, Precio */}
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      label="Precio"
                                      name="precio"
                                      value={producto.precio}
                                      onChange={handleChange}
                                      InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1 }}>S/</Typography>,
                                      }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label="Tipo"
                                      name="tipo"
                                      value={producto.tipo}
                                      onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            {/* Tipo, Stock */}
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label="Stock"
                                      name="stock"
                                      value={producto.stock}
                                      onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            {/* Botón Guardar */}
                            <Box sx={{ mt: 4, textAlign: 'right' }}>
                                <Button 
                                  variant="contained" 
                                  color="primary"
                                  onClick={handleSubmit}
                                  sx={{ backgroundColor: 'black' }} // Fondo negro para el botón
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

            </Box>
        </div>
    );
};

export default AgregarProducto;