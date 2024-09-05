import React from 'react';
import { TextField, Grid, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2'; 

const InicioSesion = () => {
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
   
  };

  return (
    <div>
      <Header2 />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Ingrese sus datos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de usuario"
                variant="outlined"
                required
                InputProps={{ style: { borderRadius: 50 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                variant="outlined"
                required
                type="password"
                InputProps={{ style: { borderRadius: 50 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#567C8D', color: '#ffffff', borderRadius: 50 }}
              >
                Iniciar Sesión
              </Button>
            </Grid>
          </Grid>
          <Box mt={2} textAlign="center">
            <Link onClick={() => navigate('/Registro')} sx={{ textDecoration: 'none' }}>
              ¿Aún no tienes cuenta? Regístrate aquí
            </Link>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default InicioSesion;