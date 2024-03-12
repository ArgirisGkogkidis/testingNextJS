import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Grid, Button, Box } from '@mui/material';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { format } from 'date-fns';

const ViewPacks = (props) => {
  const { tracking, accounts } = props;
  const [superPacks, setSuperPacks] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);

  const formatQuantity = (quantity) => {
    // Assuming quantity is given in grams and you convert to KG if it's more than 1000 grams
    return quantity >= 1000
      ? `${(quantity / 1000000).toFixed(2)} KG`
      : `${quantity.toFixed(2)} Grams`;
  };
  const handleOpenLink = (url) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/all`,
        );
        setAvailableIngredients(response.data.data);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }
    };
    fetchIngredients();

    const fetchPacks = async () => {
      const superPackHashes = await tracking.methods.getUserSuperPacks(accounts).call();

      const superPackDetailsPromises = superPackHashes.map(async (hash) => {
        const internalPackHashes = await tracking.methods.getSuperPackMapping(hash).call();
        const internalPackDetailsPromises = internalPackHashes.map(async (internalHash) => {
          return tracking.methods.viewPack(internalHash).call();
        });
        const internalPacks = await Promise.all(internalPackDetailsPromises);

        let recipeName = 'NaN'
        try{
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/by-pack/${internalPackHashes[0]}`,
        );
        recipeName = response.data.title;
        }
        catch(error){console.log(error)}

        let internalPacksData = internalPacks[0][1].map(async (ingredient) => {
          const tknD = await tracking.methods.getTokenData(ingredient).call();
          const dbIngredient = availableIngredients.find((ing) => ing.id === Number(tknD[0]));
          console.log(dbIngredient);
          const tokenInfo = {
            name: dbIngredient?.name,
            quantity: formatQuantity(tknD[2]),
          };
          return tokenInfo;
        });
        internalPacksData = await Promise.all(internalPacksData);

        return { hash, internalPackHashes, internalPacks, internalPacksData, recipeName };
      });
      const superPacks = await Promise.all(superPackDetailsPromises);
      setSuperPacks(superPacks);

      console.log(superPacks);
    };

    fetchPacks();
  }, [accounts]);

  // Function to handle the download of the QR code
  const downloadQRCode = (hash) => {
    const canvas = document.getElementById(`qr-${hash}`);
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${hash}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h4' gutterBottom>
          My Packs
        </Typography>
      </Grid>
      {superPacks.map((superPack) => (
        <Grid item xs={12} sm={6} md={4} key={superPack.hash}>
          <Card>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                Pack: {superPack.recipeName}
              </Typography>
              <Typography>
                Created on:{' '}
                {format(new Date(superPack.internalPacks[0][2] * 1000), 'HH:mm:ss dd/MM/yyyy')}
              </Typography>
              {superPack.internalPacksData.map((pack, index) => (
                <React.Fragment key={index}>
                  <Typography variant='body2'>
                    {pack.name} - Quantity: {pack.quantity}
                  </Typography>
                </React.Fragment>
              ))}
            </CardContent>
            <CardActions>
              <Button size='small' onClick={() => downloadQRCode(superPack.internalPackHashes[0])}>
                Download QR
              </Button>

              <Button size="small" color="primary" onClick={() => handleOpenLink(`https://foodchain.isl.edu.gr/viewpack/${superPack.internalPackHashes[0]}`)}>
                View
              </Button>
            </CardActions>
            <div style={{ display: 'none' }}>
              <QRCode
                id={`qr-${superPack.internalPackHashes[0]}`}
                value={`https://foodchain.isl.edu.gr/viewpack/${superPack.internalPackHashes[0]}`}
                size={250}
                level={'H'}
                includeMargin={true}
              />
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ViewPacks;
