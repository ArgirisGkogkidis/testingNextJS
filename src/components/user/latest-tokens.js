import React from 'react'
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  IconButton, Menu, MenuItem
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ingridients from '../../utils/ingridients'
import TransferModal from './actions/transfer-token';
import SplitModal from './actions/split-token';

export const LatestTokens = (props) => {

  const { tracking, accounts } = props
  const [tokenData, setTokenData] = React.useState([{
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending',
    actions: []
  },])

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [transferModalOpen, setTransferModalOpen] = React.useState(false);
  const [splitModalOpen, setSplitModalOpen] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState(null);

  let idCounter = 0;

  React.useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    setTokenData([]); // Reset token data before fetching new data
    idCounter = 0; // Reset counter
    const results = await tracking.methods.getUserTokens(accounts).call();
    results.forEach((result) => {
      initData(result);
    });
  };


  async function initData(tokenHash) {
    // Skip if the result is the zero address
    if (tokenHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      return; // Skip this iteration and continue with the next loop iteration
    }
    const tknD = await tracking.methods.getTokenData(tokenHash).call()
    console.log(Number(tknD[1]) === 1 ? 'ready' : (Number(tknD[1]) == 2 ? 'transfered' : 'packed'));
    if (tknD[3] === accounts && idCounter <= 8) {
      setTokenData(prevPermisions => ([
        ...prevPermisions,
        {
          id: uuid(),
          ref: tokenHash,
          ingridient: Number(tknD[0]),
          amount: tknD[2],
          customer: {
            name: ingridients.data.ingridients[tknD[0]].name
          },
          createdAt: tknD[6] * 1000,
          status: Number(tknD[1]) === 1 ? 'ready' : (Number(tknD[1]) == 2 ? 'transfered' : 'packed'),
          actions: Number(tknD[1]) === 1 ? ['Transfer', 'Split'] : [] // Dynamic actions based on status
        }
      ]))
      idCounter += 1
    }
  }

  const handleClick = (event, token) => {
    console.log(token); // Debug: Log the token being set
    setAnchorEl(event.currentTarget);
    setSelectedToken(token);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenTransferModal = () => {
    setTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false);
    setSelectedToken(null);
  };

  const handleOpenSplitModal = () => {
    setSplitModalOpen(true);
  };

  const handleCloseSplitModal = () => {
    setSplitModalOpen(false);
    setSelectedToken(null);
  };

  const handleActionClick = (action) => {
    handleClose(); // Close the action menu
    if (action === 'Transfer') {
      handleOpenTransferModal();
    } else if (action === 'Split') {
      handleOpenSplitModal();
    }
  };

  async function handleTransfer(recipientAddress) {
    // Implement transfer logic
    console.log("Transferring", selectedToken, "to", recipientAddress);
    if (!accounts) {
      alert("Need an Ethereum address to check")
      return;
    }
    const rs = await tracking.methods.transfer_token(selectedToken.ref, recipientAddress).send({ from: accounts });
    fetchTokens();
    handleCloseTransferModal();
  };

  const handleSplit = async (newAmount) => {
    console.log("Transferring", selectedToken, "new amount", newAmount);
    if (!accounts) {
      alert("Need an Ethereum address to check")
      return;
    }
    const rs = await tracking.methods.split_token(selectedToken.ingridient, selectedToken.ref, newAmount).send({ from: accounts });
    fetchTokens();
    handleCloseSplitModal();
  };

  // Define the function for minting a new token
  const handleMintToken = async () => {
    // Logic to mint a new token
    // This usually involves calling a smart contract function
    // For example: await contract.methods.mintToken(...params).send({ from: accounts });
    console.log('Minting a new token...');
    // After minting, you may want to refresh the token list
    fetchTokens(); // Assuming fetchTokens fetches the updated list of tokens
  };

  return (
    <>
      <Card {...props}>
        <CardHeader
          title="Latest Tokens"
          action={
            <Button
              color="primary"
              variant="contained"
              onClick={handleMintToken}
            >
              Mint New Token
            </Button>
          }
        />
        <PerfectScrollbar>
          <Box sx={{ minWidth: 100 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Token Hash
                  </TableCell>
                  <TableCell>
                    Token Type
                  </TableCell>
                  <TableCell>
                    Token Quantity
                  </TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Date Minted
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokenData.map((token) => (
                  <TableRow
                    hover
                    key={token.id}
                  >
                    <TableCell>
                      {token.ref}
                    </TableCell>
                    <TableCell>
                      {token.customer.name}
                    </TableCell>
                    <TableCell>
                      {token.amount}
                    </TableCell>
                    <TableCell>
                      {format(token.createdAt, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <SeverityPill
                        color={(token.status === 'ready' && 'success')
                          || (token.status === 'packed' && 'error')
                          || 'warning'}
                      >
                        {token.status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {token.actions.length > 0 ?
                        <>
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleClick(e, token)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: 48 * 4.5,
                                width: '20ch',
                              },
                            }}
                          >
                            {token.actions.map((action) => (
                              <MenuItem key={action}
                                onClick={() => handleActionClick(action)}>
                                {action}
                              </MenuItem>
                            ))}
                          </Menu>
                        </> : ''
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
      <div>

        <TransferModal
          open={transferModalOpen}
          onClose={handleCloseTransferModal}
          onTransfer={handleTransfer}
          token={selectedToken}
        />
        <SplitModal
          open={splitModalOpen}
          onClose={handleCloseSplitModal}
          onSplit={handleSplit}
          token={selectedToken}
        />
      </div>
    </>
  )
};
