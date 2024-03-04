import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Box, Container, Typography, Grid } from '@mui/material';
import { PackIngredientCard } from 'src/components/user/pack/view/PackIngredientCard';
import axios from 'axios';
import { v4 as uuid } from 'uuid'; // Ensure you have 'uuid' installed

const packData = {
  "packHash": "0x0be47726aee44389eb1a1f93dbd222873c1ceca6ebfe6cb96d3705a3fb482919",
  "totalTokens": 4,
  "createdOn": 0,
  "totalPacks": 50,
  "tokens": [
    {
      "tokenHash": "0xf773ea79197f5d309680f8cd4a3472d204ba0568d31a8ffa09e63c3401f59f01",
      "ingredientID": 4,
      "status": 3,
      "amount": 350000,
      "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
      "pendingHolder": "0x0000000000000000000000000000000000000000",
      "mintedOn": 1709590097,
      "pastHolders": [
        {
          "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
          "timestamp": 1709589959
        },
        {
          "holderAddress": "0x1923463B7Ee126B1859D3c587659b256002D7265",
          "timestamp": 1709590053
        },
        {
          "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
          "timestamp": 1709590078
        }
      ]
    },
    {
      "tokenHash": "0xe52ce28d27d10db57588731c8eb06ab8f4c8aef0e6847e09c06d94cee08de2f8",
      "ingredientID": 1,
      "status": 3,
      "amount": 6500000,
      "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
      "pendingHolder": "0x0000000000000000000000000000000000000000",
      "mintedOn": 1709590097,
      "pastHolders": [
        {
          "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
          "timestamp": 1709583697
        }
      ]
    },
    {
      "tokenHash": "0x062674fbc0af09d2802ada839469ae2c12882aee77a63b1c3fb28633367ebbd4",
      "ingredientID": 2,
      "status": 3,
      "amount": 7300000,
      "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
      "pendingHolder": "0x0000000000000000000000000000000000000000",
      "mintedOn": 1709590097,
      "pastHolders": [
        {
          "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
          "timestamp": 1709583697
        }
      ]
    },
    {
      "tokenHash": "0xfcefa43ee092bf212f4f5b41d84f48bc2080865582d81807a2783bd99eaee2c4",
      "ingredientID": 3,
      "status": 3,
      "amount": 6500000,
      "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
      "pendingHolder": "0x0000000000000000000000000000000000000000",
      "mintedOn": 1709590097,
      "pastHolders": [
        {
          "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
          "timestamp": 1709583697
        }
      ]
    }
  ]
}

const PackDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tokenData, setTokenData] = useState([])
  // Helper function to format timestamps
  const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleDateString("en-US");
  function milligramsToKilograms(milligrams) {
    return milligrams / 1000000;
  }

  useEffect(() => {
    setTokenData([])
    fetchData()
  }, [])
  async function fetchData() {
    try {
      // Assuming this URL returns the packData structure shown earlier
      // const packResponse = await axios.get('http://your-api-endpoint.com/api/packData');
      // const packData = packResponse.data;

      for (let token of packData.tokens) {
        const pastHoldersPromises = token.pastHolders.map(async (holder) => {
          if (holder.holderAddress === "0x0000000000000000000000000000000000000000") return null;
          const response = await axios.get('http://localhost:4000/api/v1/', { params: { wallet: holder.holderAddress } });
          const user = response.data.data.user[0];
          return `${user.firstName} ${user.lastName}`;
        });

        const pastHolders = (await Promise.all(pastHoldersPromises)).filter(Boolean).join(', ');

        const ingredientResponse = await axios.get(`http://127.0.0.1:4000/api/v1/ingridient/${token.ingredientID}`);
        const ingredient = ingredientResponse.data.data[0];

        setTokenData((prevData) => [
          ...prevData,
          {
            id: uuid(),
            ref: token.tokenHash,
            ingredient: token.ingredientID,
            amount: `${milligramsToKilograms(token.amount)} KG`,
            customer: {
              name: pastHolders || 'N/A', // Assuming you want to display past holders as customers
            },
            createdAt: token.mintedOn * 1000,
            status: token.status === 1 ? 'ready' : (token.status === 2 ? 'transfered' : 'packed'),
            actions: [
              ...(token.status === 1 ? ['Transfer'] : []),
              ...(token.status === 1 ? ['Split'] : [])
            ],
            meta: { // Ensure this property is correctly populated
              name: ingredient.name || 'Unknown Ingredient',
              image: ingredient.image || 'default_image_url_here'
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching pack data:", error);
    }
  }

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Typography sx={{ m: 1 }} variant="h4">View Pack ({packData.packHash})</Typography>
          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 3 }}>
            <Grid container spacing={3}>
              {tokenData.map((token, index) => (
                <PackIngredientCard key={index} product={token} />
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PackDetail;
