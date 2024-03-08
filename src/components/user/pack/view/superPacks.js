import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import QRCode from 'qrcode.react';

const ViewPacks = (props) => {
  const { tracking, accounts } = props;
  const [superPacks, setSuperPacks] = useState([]);

  useEffect(() => {
    const fetchPacks = async () => {
      const superPackHashes = await tracking.methods.getUserSuperPacks(accounts).call();
      
      const superPackDetailsPromises = superPackHashes.map(async (hash) => {
        const internalPackHashes = await tracking.methods.getSuperPackMapping(hash).call();
        const internalPackDetailsPromises = internalPackHashes.map(async (internalHash) => {
          console.log(internalHash);
          return tracking.methods.viewPack(internalHash).call();
        });
        const internalPacks = await Promise.all(internalPackDetailsPromises);
        console.log(internalPacks)
        return { hash, internalPackHashes, internalPacks };
      });
      const superPacks = await Promise.all(superPackDetailsPromises);
      setSuperPacks(superPacks);
    };

    fetchPacks();
  }, [accounts]);

  // Function to handle the download of the QR code
  const downloadQRCode = (hash) => {
    const canvas = document.getElementById(`qr-${hash}`);
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${hash}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          My Packs
        </Typography>
      </Grid>
      {superPacks.map((superPack) => (
        <Grid item xs={12} sm={6} md={4} key={superPack.hash}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Super Pack
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {superPack.hash}
              </Typography>
              <Box sx={{ my: 2 }}>
                <QRCode
                  id={`qr-${superPack.hash}`}
                  value={`https://foodchain.isl.edu.gr/viewpack/${superPack.hash}`}
                  size={128}
                  level={"H"}
                  includeMargin={true}
                />
              </Box>
              <Button
                variant="contained"
                onClick={() => downloadQRCode(superPack.hash)}
              >
                Download QR
              </Button>
              {superPack.internalPacks.map((pack, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Pack {superPack.internalPackHashes[index]} - Length: {pack[0]}
                  </Typography>
                  <ul>
                    {pack[1].map((tknd, idx) => (
                      <li key={idx}>Token: {tknd}</li> // Expand this according to your pack details
                    ))}
                  </ul>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default ViewPacks;
