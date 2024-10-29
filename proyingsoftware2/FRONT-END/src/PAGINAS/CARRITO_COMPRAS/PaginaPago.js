import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

import { Box, Typography, Paper, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid, MenuItem, Select } from '@mui/material';
import HeaderAdmin from '../../COMPONENTES/Header_Admin';

const PaginaPago = () => {
  const [metodoEntrega, setMetodoEntrega] = useState('recojo');  // Controla el método de entrega
  const [botica, setBotica] = useState('');  // Botica seleccionada
  const [direccion, setDireccion] = useState('');  // Dirección de entrega para "Entrega a casa"
  const [numeroTarjeta, setNumeroTarjeta] = useState('');  // Número de tarjeta
  const [errorTarjeta, setErrorTarjeta] = useState('');  // Mensaje de error para la tarjeta
  const [cvv, setCvv] = useState('');  // CVV
  const [errorCvv, setErrorCvv] = useState('');  // Mensaje de error para el CVV
  const [productos, setProductos] = useState([]);  // Productos del carrito
  const TASA_IMPUESTO = 0.18;  // Por ejemplo, 18% de impuesto
  const navigate = useNavigate(); 

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const usuarioID = usuario?.id;
    if(usuarioID){
      fetch(`http://localhost:4000/api/ordenes/${usuarioID}`)
      .then(response=>{
        if (!response.ok) {
          throw new Error('Error al obtener los productos del carrito');
        }
        return response.json();  
      })
      .then(data=>{
        console.log('Productos en el carrito:', data);
        setProductos(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else {
      alert('No se encontró información del usuario. Por favor, inicia sesión.');
    }
  }, []);

  const calcularCostoEnvio = () => {
    return metodoEntrega === 'entrega' ? 10.00 : 0.00; // 10 soles si es entrega a domicilio, 0 si es recojo en tienda
  };
  
  const calcularImpuesto = () => {
    const subtotal = parseFloat(calcularTotal());  // Subtotal del carrito
    const costoEnvio = calcularCostoEnvio();
    return (subtotal + costoEnvio) * TASA_IMPUESTO;  // Aplicar impuesto sobre subtotal + costo de envío
  };
  
  const calcularTotalConImpuesto = () => {
    const subtotal = parseFloat(calcularTotal());
    const costoEnvio = calcularCostoEnvio();
    const impuesto = calcularImpuesto();
    return (subtotal + costoEnvio + impuesto).toFixed(2);  // Total con costo de envío e impuesto
  };

  const handleMetodoEntregaChange = (event) => {
    setMetodoEntrega(event.target.value);
  };

  const handleBoticaChange = (event) => {
    setBotica(event.target.value);
  };

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
  };

  const validarNumeroTarjeta = (numero) => {
    const visaMastercardRegex = /^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5][0-9]{14}$/; // Visa o Mastercard

    if (visaMastercardRegex.test(numero)) {
      setErrorTarjeta('');
    } else {
      setErrorTarjeta('Número de tarjeta inválido. Visa/Mastercard: 16 dígitos');
    }
  };

  const handleNumeroTarjetaChange = (event) => {
    const numero = event.target.value.replace(/\D/g, '');  // Eliminar caracteres no numéricos
    setNumeroTarjeta(numero);
    validarNumeroTarjeta(numero);
  };

  const validarCvv = (numeroCvv) => {
    const visaMastercardRegex = /^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5][0-9]{14}$/; // Visa o Mastercard
    const amexRegex = /^3[47][0-9]{13}$/; // American Express

    if (visaMastercardRegex.test(numeroTarjeta)) {
      if (numeroCvv.length !== 3) {
        setErrorCvv('El CVV para Visa/Mastercard debe ser de 3 dígitos');
      } else {
        setErrorCvv('');
      }
    } else if (amexRegex.test(numeroTarjeta)) {
      if (numeroCvv.length !== 4) {
        setErrorCvv('El CVV para American Express debe ser de 4 dígitos');
      } else {
        setErrorCvv('');
      }
    }
  };

  const handleCvvChange = (event) => {
    const cvvValue = event.target.value.replace(/\D/g, '');  // Eliminar caracteres no numéricos
    setCvv(cvvValue);
    validarCvv(cvvValue);
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(2);
  };



  const handleFinalizarCompra = async () => {
    if (!metodoEntrega) {
        alert('Selecciona un método de entrega.');
        return;
    }

    if (metodoEntrega === 'recojo' && !botica) {
        alert('Selecciona una botica para el recojo.');
        return;
    }

    if (metodoEntrega === 'entrega' && !direccion) {
        alert('Ingrese una dirección de entrega válida.');
        return;
    }

    if (!numeroTarjeta || errorTarjeta) {
        alert('Ingrese un número de tarjeta válido.');
        return;
    }

    if (!cvv || errorCvv) {
        alert('Ingrese un CVV válido.');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('user'));
    const usuarioID = usuario?.id;

    try {
        // Llamada a la API para crear la orden
        const response = await fetch(`http://localhost:4000/api/ordenes/crearOrden/${usuarioID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                direccionEnvio: metodoEntrega === 'entrega' ? direccion : '',
                metodoEntrega: metodoEntrega,
                botica: metodoEntrega === 'recojo' ? botica : '',
            }),
        });

        const data = await response.json();

        if (response.ok && data.ordenes?.length > 0) {
            const ordenesCreadas = data.ordenes; // Array de órdenes creadas

            // Almacenar detalles de la orden en localStorage si es necesario
            localStorage.setItem('orden', JSON.stringify({
                estado: 'pendiente',
                total: data.totalGeneral, // Puedes sumar el total de todas las órdenes creadas
            }));

            // Ejecutar la lógica adicional (como actualizar stock o llenar la tabla de productos)
            for (const orden of ordenesCreadas) {
                const llenarProductoOrdenResponse = await fetch(`http://localhost:4000/api/ordenes/llenarProductoOrden/${usuarioID}/${orden.id}`, {
                    method: 'POST',
                });

                const productoOrdenData = await llenarProductoOrdenResponse.json();

                if (!llenarProductoOrdenResponse.ok) {
                    console.error('Error al llenar ProductoOrden para la orden:', orden.id);
                    alert(`Error al añadir productos a la orden ID ${orden.id}.`);
                    return;
                }
            }

            // Eliminar el carrito solo si todas las operaciones fueron exitosas
            await fetch(`http://localhost:4000/api/ordenes/eliminarCarrito/${usuarioID}`, {
                method: 'DELETE',
            });

            alert('Compra realizada con éxito. Se crearon las órdenes para cada botica.');
            navigate('/');
        } else {
            console.error('Error en la respuesta del servidor:', data);
            alert('Error al realizar la compra: ' + (data.mensaje || 'Error desconocido.'));
        }
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        alert('Ocurrió un error al procesar tu compra. Inténtelo nuevamente.');
    }
};









  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderAdmin />
      
      <Box sx={{ flexGrow: 1, mx: 4, mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#D6E9FE',
            padding: '10px 20px',
            borderRadius: '8px',
            mb: 4,
          }}
        >
          <Typography variant="h6">Proceso de Pago</Typography>
        </Box>

        {/* Resumen del Pedido */}
<Paper sx={{ padding: '20px', mb: 4 }}>
  <Typography variant="h6">Resumen del Pedido</Typography>
  
  {productos.map((producto) => (
    <Box key={producto.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Typography>{producto.nombre} (x{producto.cantidad})</Typography>
      <Typography>S/ {(producto.precio * producto.cantidad).toFixed(2)}</Typography>
    </Box>
  ))}
 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
    <Typography>Costo de Envío:</Typography>
    <Typography>S/ {calcularCostoEnvio().toFixed(2)}</Typography> {/* Mostrar costo de envío */}
  </Box>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
    <Typography>Impuesto (18%):</Typography>
    <Typography>S/ {calcularImpuesto().toFixed(2)}</Typography> {/* Mostrar impuesto */}
  </Box>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
    <Typography variant="h6">Total:</Typography>
    <Typography variant="h6">S/ {calcularTotalConImpuesto()}</Typography> {/* Mostrar total */}
  </Box>
</Paper>


        {/* Método de Entrega */}
        <Paper sx={{ padding: '20px', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Método de Entrega</Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Selecciona el método de entrega</FormLabel>
            <RadioGroup
              aria-label="metodo-entrega"
              name="metodo-entrega"
              value={metodoEntrega}
              onChange={handleMetodoEntregaChange}
            >
              <FormControlLabel value="recojo" control={<Radio />} label="Recojo en Tienda (Gratis)" />
              <FormControlLabel value="entrega" control={<Radio />} label="Entrega a Casa" />
            </RadioGroup>
          </FormControl>

          {metodoEntrega === 'recojo' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Selecciona la Botica para Recojo:</Typography>
              <Select
                fullWidth
                value={botica}
                onChange={handleBoticaChange}
                displayEmpty
                sx={{ mt: 2 }}
              >
                <MenuItem value="" disabled>
                  Selecciona una botica
                </MenuItem>
                <MenuItem value="Botica Central">Botica Central</MenuItem>
                <MenuItem value="Botica Sur">Botica Sur</MenuItem>
                <MenuItem value="Botica Norte">Botica Norte</MenuItem>
              </Select>
            </Box>
          )}

          {metodoEntrega === 'entrega' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Ingrese la Dirección de Entrega:</Typography>
              <TextField
                fullWidth
                label="Dirección de Entrega"
                variant="outlined"
                value={direccion}
                onChange={handleDireccionChange}
                required
              />
            </Box>
          )}
        </Paper>

        {/* Método de Pago */}
        <Paper sx={{ padding: '20px', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Método de Pago</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Tarjeta"
                variant="outlined"
                required
                value={numeroTarjeta}
                onChange={handleNumeroTarjetaChange}
                error={!!errorTarjeta}
                helperText={errorTarjeta}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Fecha de Expiración" variant="outlined" placeholder="MM/YY" required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="CVV"
                variant="outlined"
                required
                value={cvv}
                onChange={handleCvvChange}
                error={!!errorCvv}
                helperText={errorCvv}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '50%' }}
            onClick={handleFinalizarCompra}
            disabled={!!errorTarjeta || !!errorCvv}
          >
            Finalizar Compra
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaginaPago;
