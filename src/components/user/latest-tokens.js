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
import ingredients from '../../utils/ingredients'
import TransferModal from './actions/transfer-token';
import SplitModal from './actions/split-token';
import MintModal from './actions/mint-token';
import axios from 'axios'


export const LatestTokens = (props) => {

  const { tracking, accounts, userperms, management } = props
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
  const [mintModalOpen, setMintModalOpen] = React.useState(false);
  const [splitModalOpen, setSplitModalOpen] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState(null);

  let idCounter = 0;

  React.useEffect(() => {
    if (Object.keys(userperms).length > 0) {
      // Call fetchLatestTokens and wait for it to complete before calling onRefreshComplete
      fetchTokens();
    }
  }, [props.refreshtokens, userperms]);

  const fetchTokens = async () => {
    setTokenData([]); // Reset token data before fetching new data
    idCounter = 0; // Reset counter
    const results = await tracking.methods.getUserTokens(accounts).call();
    results.forEach((result) => {
      initData(result);
    });
  };

  const milligramsToKilograms = (milligrams) => milligrams / 1e6;

  async function initData(tokenHash) {
    // Skip if the result is the zero address
    if (tokenHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      return; // Skip this iteration and continue with the next loop iteration
    }
    const tknD = await tracking.methods.getTokenData(tokenHash).call()

    // Assuming userperms is available in your component's state or props
    const hasTransferPermission = userperms?.canTransfer ?? false;
    const hasSplitPermission = userperms?.canSplit ?? false;

    if (tknD[3] === accounts && idCounter <= 8) {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingridient/` + tknD[0]);

      setTokenData(prevPermisions => ([
        ...prevPermisions,
        {
          id: uuid(),
          ref: tokenHash,
          ingredient: Number(tknD[0]),
          amount: milligramsToKilograms(tknD[2]) + ' KG',
          customer: {
            name: data.data.data[0]?.name
          },
          createdAt: tknD[5] * 1000,
          status: Number(tknD[1]) === 1 ? 'ready' : (Number(tknD[1]) == 2 ? 'transfered' : 'packed'),
          actions: [
            ...(Number(tknD[1]) === 1 && hasTransferPermission ? ['Transfer'] : []),
            ...(Number(tknD[1]) === 1 && hasSplitPermission ? ['Split'] : [])
          ]
        }
      ]))
      idCounter += 1
    }
  }

  const handleClick = (event, token) => {
    // console.log(token); // Debug: Log the token being set
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

  const handleOpenMintModal = () => {
    setMintModalOpen(true);
  };

  const handleCloseMintModal = () => {
    setMintModalOpen(false);
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
    const rs = await tracking.methods.split_token(selectedToken.ingredient, selectedToken.ref, newAmount).send({ from: accounts });
    fetchTokens();
    handleCloseSplitModal();
  };

  return (
    <>
      <Card {...props}>
        <CardHeader
          title="Latest Tokens"
          action={userperms?.canMint ?
            <Button
              color="primary"
              variant="contained"
              onClick={handleOpenMintModal}
            >
              Mint New Token
            </Button>
            : ''
          }
        />
        <PerfectScrollbar>
          <Box sx={{ minWidth: 100, maxHeight: 400, overflowY: 'auto' }}>
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
          management={management}
        />
        <SplitModal
          open={splitModalOpen}
          onClose={handleCloseSplitModal}
          onSplit={handleSplit}
          token={selectedToken}
        />
        <MintModal
          isopen={mintModalOpen}
          onClose={handleCloseMintModal}
          management={management}
          tracking={tracking}
          accounts={accounts}
          triggerrefresh={props.onrefreshcomplete}
        />
      </div>
    </>
  )
};
