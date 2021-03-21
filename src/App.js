import React  from 'react';
import Button from './components/Button/Button';
import Widget from './components/Widget/Widget';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      active:       false,
      dataReceived: false,
      dataSlice:    null
    };
    
    this.quotes = [];
    this.socket = null;
    
    this.startButtonClickHandler      = this.startButtonClickHandler.bind(this);
    this.statisticsButtonClickHandler = this.statisticsButtonClickHandler.bind(this);
  }
  
  start() {
    console.log('[WS] Connecting...');
    
    this.socket = new WebSocket('wss://trade.trademux.net:8800/?password=1234');
    
    this.socket.onopen = e => {
      console.log('[WS] Connection established');
    };
    
    this.socket.onmessage = e => {
      if (!this.state.dataReceived) {
        this.setState({dataReceived: true});
      }
      
      const data = JSON.parse(e.data);
      this.quotes.push(data.value);
    };
    
    this.socket.onclose = e => {
      if (e.wasClean) {
        console.log(`[WS] Connection closed cleanly, code: ${e.code}`);
      } else {
        console.error('[WS] Disconnected');
      }
    };
    
    this.socket.onerror = e => {
      console.error(`[WS] ${e.message}`);
      this.start();
    };
  }
  
  stop() {
    this.socket.close();
  }
  
  startButtonClickHandler() {
    if (this.state.active) {
      this.setState({
        active:       false,
        dataReceived: false,
        dataSlice:    null,
      });
      
      this.quotes = [];
      this.stop();
    } else {
      this.setState({active: true});
      this.start();
    }
  }
  
  statisticsButtonClickHandler() {
    if (!this.state.dataReceived) {
      return;
    }
    
    const calculateSd = avg => {
      return Math.round(Math.sqrt(
          this.quotes.map(quote => (quote - avg) ** 2).reduce((acc, cur) => acc + cur, 0) /
          quotesCount
      ));
    };
    
    const calculateMo = () => {
      const values = {};
      
      for (let value of this.quotes) {
        if (values[value]) {
          values[value]++;
        } else {
          values[value] = 1;
        }
      }
      
      let max    = 0;
      let maxKey = null;
      
      for (let key in values) {
        if (values[key] > max) {
          max    = values[key];
          maxKey = key;
        }
      }
      
      return maxKey;
    };
    
    const calculateMe = () => {
      return this.quotes.slice(0).sort((a, b) => a - b)[Math.round(this.quotes.length / 2)];
    };
    
    const quotesSum   = this.quotes.reduce((acc, cur) => acc + cur, 0);
    const quotesCount = this.quotes.length;
    
    /**
     * Average
     *
     * @type {number|number}
     */
    const avg = Math.round(quotesSum / quotesCount) || 0;
    
    /**
     * Standard deviation
     *
     * @type {number|number}
     */
    const sd = calculateSd(avg);
    
    /**
     * Mode
     *
     * @type {number|number}
     */
    const mo = calculateMo();
    
    /**
     * Median
     *
     * @type {number|number}
     */
    const me = calculateMe();
    
    this.setState({
      dataSlice: {avg, sd, mo, me}
    });
  }
  
  render() {
    return (
        <div className={'app'}>
          <div className={'buttons-wrap'}>
            <Button
                click={this.startButtonClickHandler}
                title={this.state.active ? 'Stop' : 'Start'}
                color={this.state.active ? 'error' : 'primary'}
            />
            <Button
                title={'Statistics'}
                click={this.statisticsButtonClickHandler}
                disabled={!this.state.dataReceived}
                color={'success'}
            />
          </div>
          <Widget active={this.state.dataSlice !== null} data={this.state.dataSlice}></Widget>
        </div>
    );
  };
}
