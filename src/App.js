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
    
    this.quotes = {};
    this.socket = null;
    
    this.startButtonClickHandler      = this.startButtonClickHandler.bind(this);
    this.statisticsButtonClickHandler = this.statisticsButtonClickHandler.bind(this);
  }
  
  start() {
    this.setState({active: true});
    
    console.log('[WS] Connecting...');
    
    this.socket = new WebSocket('wss://trade.trademux.net:8800/?password=1234');
    
    this.socket.onopen = e => {
      console.log('[WS] Connection established');
    };
    
    this.socket.onmessage = e => {
      if (!this.state.dataReceived) {
        this.setState({dataReceived: true});
      }
      
      const data              = JSON.parse(e.data);
      this.quotes[data.value] = this.quotes[data.value] === undefined ? 1 : this.quotes[data.value] + 1;
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
    
    this.setState({
      active:       false,
      dataReceived: false,
      dataSlice:    null,
    });
    
    this.quotes = {};
  }
  
  startButtonClickHandler() {
    return this.state.active ? this.stop() : this.start();
  }
  
  statisticsButtonClickHandler() {
    const getQuotesSum = () => {
      return Object.entries(this.quotes).reduce((acc, cur) => acc + +cur[0] * +cur[1], 0);
    };
    
    const getQuotesCount = () => {
      return Object.values(this.quotes).reduce((acc, cur) => acc + cur, 0);
    };
    
    const getQuotesAverage = (sum, count) => {
      return Math.round(sum / count) || 0;
    };
    
    const getQuotesStandartDeviation = (average, count) => {
      const total = Object.entries(this.quotes).reduce((acc, cur) => {
        let sum = 0;
        
        for (let i = 0; i < +cur[1]; i++) {
          sum += (+cur[0] - average) ** 2;
        }
        
        return acc + sum;
      }, 0);
      
      return Math.round(Math.sqrt(total / count));
    };
    
    const getQuotesMode = () => {
      let maxValue = 0;
      let maxKey   = null;
      
      for (let key in this.quotes) {
        if (+this.quotes[key] > +maxValue) {
          maxValue = +this.quotes[key];
          maxKey   = +key;
        }
      }
      
      return +maxKey;
    };
    
    const getQuotesMedian = count => {
      const position = Math.round(count / 2);
      let counter    = 0;
      
      for (let key in this.quotes) {
        counter += this.quotes[key];
        
        if (counter > position) {
          return +key;
        }
      }
    };
    
    const count             = getQuotesCount();
    const sum               = getQuotesSum();
    const average           = getQuotesAverage(sum, count);
    const standartDeviation = getQuotesStandartDeviation(average, count);
    const mode              = getQuotesMode();
    const median            = getQuotesMedian(count);
    
    this.setState({
      dataSlice: {average, standartDeviation, mode, median}
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
