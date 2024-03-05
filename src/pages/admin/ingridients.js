import React, { useEffect, useState, useCallback } from "react";
import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import axios from 'axios'
import { ProductListToolbar } from '../../components/product/product-list-toolbar';
import { ProductCard } from '../../components/product/product-card';
import IngredientModal from "src/components/product/ingredient-modal";

const Products = (props) => {
  const { management, accounts, userPerms } = props
  const [products, setProducts] = useState([]);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [ingredient, setIngredient] = useState({
    id: '',
    name: '',
    icon: null,
  });

  const updateIngredient = useCallback((key, value) => {
    setIngredient(prev => ({ ...prev, [key]: value }));
  }, []);

  // Inside Products component
  const handleEditIngredient = (ingredient) => {
    setIngredient({
      id: ingredient.id.toString(), // Ensure the id is a string if it's not already
      name: ingredient.name,
      icon: ingredient.icon, // This should be the path to the image or the base64 encoded string
    });
    handleOpenTransferModal();
  };


  const handleOpenTransferModal = () => {
    setTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false);
  };

  async function handleTransfer(newProduct) {
    // Implement transfer logic
    console.log("Creating new product", accounts, "to", newProduct);
    if (!accounts) {
      alert("Need an Ethereum address to check")
      return;
    }
    // Here you would handle the form submission.
    const rs = await management.methods.set_user_perms(accounts, newProduct.id, true, true, true, true, true).send({ from: accounts });

    const payload = {
      id: newProduct.id, // Assuming this is set from a form or state
      name: newProduct.name, // Assuming this is set from a form or state
      icon: newProduct.icon, // This should be the base64 encoded string of the image
    };

    try {
      // Make the POST request to your backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/`, payload);
      fetchUserPerms();
      // Handle success (e.g., showing a success message or clearing the form)
    } catch (error) {
      console.error('Error submitting ingredient:', error.response ? error.response.data : error.message);
      // Handle error (e.g., showing an error message)
    }
    handleCloseTransferModal();
  };

  useEffect(() => {
    fetchUserPerms();
  }, [])

  const fetchUserPerms = async () => {
    setProducts([]);
    await management.methods.getIngredientIDs().call().then(async ingredientIDs => {
      for (const ingredientID of ingredientIDs) {
        console.log("Ing ID: ", ingredientID)
        const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/` + ingredientID);
        console.log('dbdata', data.data.data[0]);
        setProducts(prevProducts => ([
          ...prevProducts,
          {
            id: ingredientID,
            icon: data.data.data[0]?.icon,
            name: data.data.data[0]?.name,
          }
        ]))
      }
    });
  };
  return (
    <>
      <Head>
        <title>
          Ingridients
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar handleOpenTransferModal={handleOpenTransferModal} />
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {products.map((product) => (
                <Grid
                  item
                  key={product.id}
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <ProductCard product={product} onEditIngredient={handleEditIngredient} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 3
            }}
          >
            <Pagination
              color="primary"
              count={3}
              size="small"
            />
          </Box>
        </Container>
      </Box>
      <IngredientModal
        open={transferModalOpen}
        onClose={handleCloseTransferModal}
        onSaveIngredient={handleTransfer}
        ingredient={ingredient}
        updateIngredient={updateIngredient}
      />
    </>
  )
}

// Products.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default Products;
