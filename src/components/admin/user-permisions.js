import React from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Skeleton
} from '@mui/material';

export default function UserPerms(props) {
  const contract = props.managementContract
  const userEthereumAddress = props.address
  const ingridient = props.ingridient
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState(
    {
      canMint: false,
      canTransfer: false,
      canReceive: false,
      canSplit: false,
      canPack: false
    }
  )

  React.useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      getData()
    }, 500)
  }, [])

  async function getData() {
    const userCanMint = await contract.methods.get_perm_mint(userEthereumAddress, ingridient.id).call()
    const userCanTransfer = await contract.methods.get_perm_transfer(userEthereumAddress, ingridient.id).call()
    const userCanReceive = await contract.methods.get_perm_receive(userEthereumAddress, ingridient.id).call()
    const userCanSplit = await contract.methods.get_perm_split(userEthereumAddress, ingridient.id).call()
    const userCanPack = await contract.methods.get_perm_pack(userEthereumAddress, ingridient.id).call()

    const obj = {
      canMint: userCanMint,
      canTransfer: userCanTransfer,
      canReceive: userCanReceive,
      canSplit: userCanSplit,
      canPack: userCanPack,
    }
    setFormData(obj)
    setLoading(false)
  } //, [props.ingridientID, contract, userEthereumAddress]);

  function handleChange(event) {
    const { name, checked } = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: checked
      }
    })
  }

  async function updatePerms() {
    if (!userEthereumAddress) {
      alert("Need an Ethereum address to check")
      return;
    }
    await contract.methods.set_user_perms(userEthereumAddress, props.ingridient.id, formData.canMint, formData.canTransfer, formData.canReceive, formData.canSplit, formData.canPack).send({ from: props.account });
  }

  return (
    <Grid item
      lg={3}
      md={4}
      xs={12}
      key={ingridient.id}>
      <Card style={{ width: "20rem" }}>
        <CardContent>
          <h4>UserPerms {ingridient.name}</h4>
          {
            loading ? <Skeleton sx={{ height: 235 }}
              animation="wave"
              variant="rectangular" /> :
              <><FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      name="canMint"
                      checked={formData.canMint}
                      onChange={handleChange}
                      value="formData.canMint"
                    />
                  }
                  label="Can user Mint tokens?"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="canTransfer"
                      checked={formData.canTransfer}
                      onChange={handleChange}
                      value="formData.canTransfer"
                    />
                  }
                  label="Can user transfer tokens?"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="canReceive"
                      checked={formData.canReceive}
                      onChange={handleChange}
                      value="formData.canReceive"
                    />
                  }
                  label="Can user receive tokens?"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="canSplit"
                      checked={formData.canSplit}
                      onChange={handleChange}
                      value="formData.canSplit"
                    />
                  }
                  label="Can user split tokens?"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="canPack"
                      checked={formData.canPack}
                      onChange={handleChange}
                      value="formData.canPack"
                    />
                  }
                  label="Can user pack tokens?"
                />
              </FormGroup>
                <Button color="primary"
                  onClick={updatePerms}>Update Perms</Button>
              </>
          }
        </CardContent>
      </Card>
    </Grid>
  );
}
