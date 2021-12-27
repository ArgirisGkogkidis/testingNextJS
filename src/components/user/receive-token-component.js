import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ReceiveTokenComponent = (props) => {
    const contract = props.contract

    async function acceptToken() {
        if (!props.account) {
            alert("Need an Ethereum address to check")
            return;
        }
        const ingridientID = props.token.ingridientID
        const tokenHash = props.token.tokenHash
        const rs = await contract.methods.receive_token(ingridientID, tokenHash).send({ from: props.account });
        console.log(rs)
    }
    // <li key={props.token.tokenHash}>
    //     {props.token.tokenHash}
    //     <Button
    //         color="primary"
    //         variant="contained" onClick={acceptToken}>Accept Token</Button>
    // </li>

    const [checked, setChecked] = React.useState([0]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <ListItem
            key={props.token.tokenHash}
            secondaryAction={
                <>
                    <IconButton edge="end" aria-label="add">
                        <AddCircleIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                        <DeleteOutlineIcon />
                    </IconButton>
                </>
            }
            disablePadding
        >
            <ListItemText
                primary={props.token.tokenHash}
                secondary={props.token.ingridientID}
            />
        </ListItem>
    )
}

export default ReceiveTokenComponent;