import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { omit } from 'ramda';

class EditForm extends React.Component {
  state = {
    key: '',
    secret: '',
    btcOrderAmount: 0.001,
    useDevServer: true,
    isSaveMessageOpened: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps.config });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleCheckboxChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  onReset = () => {
    this.setState({ ...this.props.config });
  };

  onSave = () => {
    this.props.onSave(omit(['isSaveMessageOpened'], this.state));
    this.setState({ isSaveMessageOpened: true });
    setTimeout(() => this.setState({ isSaveMessageOpened: false }), 17000);
  };

  render() {
    const { key, secret, btcOrderAmount, useDevServer } = this.state;

    return (
      <Paper
        elevation={1}
        style={{
          margin: 'auto',
          paddingBottom: '2em',
          maxWidth: '35em',
        }}
      >
        <form noValidate autoComplete="off">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '30em',
              margin: 'auto',
              marginTop: '5em',
              paddingTop: '2em',
            }}
          >
            <Typography variant="h5" component="h3">
              Crypto Bot Config Editor
            </Typography>
            <TextField
              required
              id="key"
              label="Key"
              onChange={this.handleChange('key')}
              margin="normal"
              value={key}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              id="secret"
              label="Secret"
              onChange={this.handleChange('secret')}
              margin="normal"
              value={secret}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              required
              type="number"
              id="btcOrderAmount"
              label="Order Amount in BTC"
              onChange={this.handleChange('btcOrderAmount')}
              margin="normal"
              inputProps={{ step: '0.001' }}
              value={btcOrderAmount}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDevServer}
                  onChange={this.handleCheckboxChange('useDevServer')}
                  value="useDevServer"
                  color="primary"
                />
              }
              label="Use Development Server"
            />
            <span
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                variant="contained"
                style={{
                  marginRight: '1em',
                }}
                onClick={this.onReset}
              >
                Reset
              </Button>
              <Button variant="contained" color="primary" onClick={this.onSave}>
                Save
              </Button>
            </span>
          </div>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.isSaveMessageOpened}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Config file was saved</span>}
        />
      </Paper>
    );
  }
}

export default EditForm;
