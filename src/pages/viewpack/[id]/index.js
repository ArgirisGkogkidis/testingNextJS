import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
} from '@mui/material';
import PackIngredientCard from 'src/components/user/pack/view/PackIngredientCard';
import axios from 'axios';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid'; // Ensure you have 'uuid' installed

// const packData = {
//   "packHash": "0x0be47726aee44389eb1a1f93dbd222873c1ceca6ebfe6cb96d3705a3fb482919",
//   "totalTokens": 4,
//   "createdOn": 0,
//   "totalPacks": 50,
//   "tokens": [
//     {
//       "tokenHash": "0xf773ea79197f5d309680f8cd4a3472d204ba0568d31a8ffa09e63c3401f59f01",
//       "ingredientID": 4,
//       "status": 3,
//       "amount": 350000,
//       "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
//       "pendingHolder": "0x0000000000000000000000000000000000000000",
//       "mintedOn": 1709590097,
//       "pastHolders": [
//         {
//           "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
//           "timestamp": 1709589959
//         },
//         {
//           "holderAddress": "0x1923463B7Ee126B1859D3c587659b256002D7265",
//           "timestamp": 1709590053
//         },
//         {
//           "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
//           "timestamp": 1709590078
//         }
//       ]
//     },
//     {
//       "tokenHash": "0xe52ce28d27d10db57588731c8eb06ab8f4c8aef0e6847e09c06d94cee08de2f8",
//       "ingredientID": 1,
//       "status": 3,
//       "amount": 6500000,
//       "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
//       "pendingHolder": "0x0000000000000000000000000000000000000000",
//       "mintedOn": 1709590097,
//       "pastHolders": [
//         {
//           "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
//           "timestamp": 1709583697
//         }
//       ]
//     },
//     {
//       "tokenHash": "0x062674fbc0af09d2802ada839469ae2c12882aee77a63b1c3fb28633367ebbd4",
//       "ingredientID": 2,
//       "status": 3,
//       "amount": 7300000,
//       "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
//       "pendingHolder": "0x0000000000000000000000000000000000000000",
//       "mintedOn": 1709590097,
//       "pastHolders": [
//         {
//           "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
//           "timestamp": 1709583697
//         }
//       ]
//     },
//     {
//       "tokenHash": "0xfcefa43ee092bf212f4f5b41d84f48bc2080865582d81807a2783bd99eaee2c4",
//       "ingredientID": 3,
//       "status": 3,
//       "amount": 6500000,
//       "holder": "0x1923463B7Ee126B1859D3c587659b256002D7265",
//       "pendingHolder": "0x0000000000000000000000000000000000000000",
//       "mintedOn": 1709590097,
//       "pastHolders": [
//         {
//           "holderAddress": "0xE8E1A1aB123B1014F402EEABcBb6046ea41A403D",
//           "timestamp": 1709583697
//         }
//       ]
//     }
//   ]
// }

const sensorData = {
  measurements: [
    {
      temp_min: 19.08789196612497,
      temp_avg: 19.246628180022547,
      temp_max: 19.443045700770583,
      hum_min: 51.96002136263066,
      hum_avg: 52.45644820833652,
      hum_max: 52.910658426794846,
      stage: 'processing',
    },
    {
      temp_min: 19.05851834897382,
      temp_avg: 19.176606223985484,
      temp_max: 19.29884794384681,
      hum_min: 52.668039978637374,
      hum_avg: 53.00729889880726,
      hum_max: 53.28297856107424,
      stage: 'storage before processing',
    },
  ],
};

const PackDetail = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [tokenData, setTokenData] = useState([]);
  const [packData, setPackData] = useState([]);

  function milligramsToKilograms(milligrams) {
    return milligrams / 1000000;
  }

  useEffect(() => {
    setLoading(true);
    if (id) {
      console.log(id);
      setTokenData([]);
      fetchData();
    }
  }, [id]);
  async function fetchData() {
    try {
      console.log('will get for:', id);
      // Assuming this URL returns the packData structure shown earlier
      const packResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pack-info/${id}`,
      );
      const packData = packResponse.data;
      // setPackData(packData);
      const packHolder = '';

      let recipeName = 'nan'
      try{
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/by-pack/${id}`)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recipes/by-pack/${id}`,
      );
      recipeName = response.data.title || 'A Salad';
      }
      catch(error){console.log(error)}

      for (let token of packData.tokens) {
        const firstHolderTimestamp = token.parentMinted;
        let previousTimestamp = firstHolderTimestamp;
        const pastHoldersPromises = token.pastHolders.map(async (holder, index) => {
          if (holder.holderAddress === '0x0000000000000000000000000000000000000000') return null;
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`, {
            params: { wallet: holder.holderAddress },
          });
          const user = response.data.data.user[0];
          const userName = `${user.firstName} ${user.lastName}`;

          // Determine the label based on the index
          const label = index === 0 ? 'Produced by' : 'Received by';
          // Use the previous timestamp for all holders except the first
          const timestamp = index === 0 ? firstHolderTimestamp : previousTimestamp;
          previousTimestamp = token.pastHolders[index].timestamp; // Update the previousTimestamp for the next iteration

          // Convert timestamp to readable format
          const date = format(new Date(timestamp * 1000), 'HH:mm:ss dd/MM/yyyy');

          return `${label} ${userName} on ${date}`;
        });

        const pastHolders = (await Promise.all(pastHoldersPromises)).filter(Boolean); //.join('\n');

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`, {
          params: { wallet: token.holder },
        });
        const user = response.data.data.user[0];
        const tokenHolder = `${user.firstName} ${user.lastName}`;

        const currentHolderString = `Received by ${tokenHolder} on ${format(
          new Date(previousTimestamp * 1000),
          'HH:mm:ss dd/MM/yyyy',
        )}`;
        // Add the current holder string to the past holders array
        pastHolders.push(currentHolderString);
        pastHolders = pastHolders.join('\n');
        console.log('Holders:', pastHolders);
        packHolder = tokenHolder;
        const ingredientResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/${token.ingredientID}`,
        );
        const ingredient = ingredientResponse.data.data[0];

        const payload = {
          ingredient: token.ingredientID,
          time_start: format(new Date(previousTimestamp * 1000), 'yyyy-MM-dd HH:mm:ss'),
          time_stop: format(new Date(Number(packData.createdOn) * 1000), 'yyyy-MM-dd HH:mm:ss'),
        };
        console.log(payload);
        // await axios
        //   .post('https://potpan.zoku.space/measurements_per_ingredient/', payload)
        //   .then((response) => {
        //     // await axios.post('http://10.31.20.65/measurements_per_ingredient/',payload) .then((response) => {
        //     console.log(response);
        //     measurement = response.measurements;
        //   })
        //   .catch((error) => {
        //     measurement = measurements;
        //     console.error(
        //       'Error making request:',
        //       error.response ? error.response.data : error.message,
        //     );
        //   });

        let measurement = ''; // Use let for variables that will be reassigned.

        try {
          const response = await axios.post(
            'https://potpan.zoku.space/measurements_per_ingredient/',
            payload,
          );
          console.log(response);
          measurement = response.data.measurements; // Make sure to access .data for the response payload
        } catch (error) {
          measurement = sensorData.measurements; // Assign default values in case of error
          console.error(
            'Error making request:',
            error.response ? error.response.data : error.message,
          );
        }

        setTokenData((prevData) => [
          ...prevData,
          {
            id: uuid(),
            ref: token.tokenHash,
            ingredient: token.ingredientID,
            amount: `${milligramsToKilograms(token.amount) / packData.totalPacks} KG`,
            pastHolders: pastHolders || 'N/A', // Assuming you want to display past holders as customers
            createdAt: token.mintedOn * 1000,
            status: token.status === 1 ? 'ready' : token.status === 2 ? 'transfered' : 'packed',
            meta: {
              // Ensure this property is correctly populated
              name: ingredient.name || 'Unknown Ingredient',
              image: ingredient.icon || 'default_image_url_here',
            },
            measurements: measurement,
          },
        ]);
      }

      packData = {
        ...packData,
        holder: packHolder,
        resipeName: recipeName,
        _createdOn: Number(packData.createdOn) * 1000,
      };

      setPackData(packData);
      console.log(packData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pack data:', error);
    }
  }

  return (
    <>
      <Box component='main' sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth='lg'>
          {loading ? (
            <Skeleton sx={{ height: 235 }} animation='wave' variant='rectangular' />
          ) : packData ? (
            <>
              <Card sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                <CardMedia
                  component='img'
                  sx={{
                    width: '33%',
                    maxWidth: '33%',
                    height: 'auto',
                    maxHeight: 140,
                    objectFit: 'contain',
                  }} // Set a maximum height here
                  image='/static/images/products/salad.png'
                  alt='Pack Image'
                />
                {/* CardContent for text, taking the remaining space */}
                <CardContent
                  sx={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ m: 1 }} variant='h4'>
                    {packData.resipeName}
                  </Typography>
                  <Typography sx={{ m: 1 }} variant='body1'>
                    Produced by: {packData.holder} on{' '}
                    {packData._createdOn
                      ? format(new Date(packData._createdOn), 'HH:mm:ss dd/MM/yyyy')
                      : ''}
                  </Typography>
                  <Typography sx={{ m: 1 }} variant='body1'>
                    Total products made: ({packData.totalPacks})
                  </Typography>
                </CardContent>
              </Card>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  mt: 3,
                }}
              >
                <Grid container spacing={3}>
                  {tokenData.map((token, index) => (
                    <PackIngredientCard key={index} product={token} />
                  ))}
                </Grid>
              </Box>
            </>
          ) : (
            'No info found'
          )}
        </Container>
      </Box>
    </>
  );
};

export default PackDetail;
