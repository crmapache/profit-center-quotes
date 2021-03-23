import {Fragment, useState, useEffect} from 'react';
import PropTypes                       from 'prop-types';
import anime                           from 'animejs';
import './widget.scss';

function Widget(props) {
  const [average, setAverage]                     = useState(0);
  const [standartDeviation, setStandartDeviation] = useState(0);
  const [mode, setMode]                           = useState(0);
  const [median, setMedian]                       = useState(0);
  
  useEffect(() => {
    if (props.data) {
      const data = {average, standartDeviation, mode, median};
      
      anime.remove(data);
      
      anime({
        targets:  data,
        average:  props.data.average,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setAverage(data.average);
        },
      });
      
      anime({
        targets:           data,
        standartDeviation: props.data.standartDeviation,
        round:             1,
        duration:          1000,
        easing:            'easeOutExpo',
        update:            anim => {
          setStandartDeviation(data.standartDeviation);
        },
      });
      
      anime({
        targets:  data,
        mode:     props.data.mode,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setMode(data.mode);
        },
      });
      
      anime({
        targets:  data,
        median:   props.data.median,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setMedian(data.median);
        },
      });
    }
    
    /**
     * Here react show annoying warning about add
     * 'average', 'standartDeviation', 'mode', 'median' in dependencies
     * but now everything work exactly how i want, so i just supress it.
     */
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  
  const content = () => {
    if (props.active) {
      function date() {
        function addLeadZero(n) {
          if (n < 10) {
            return `0${n}`;
          }
          
          return n;
        }
        
        const date = new Date();
        
        const year    = date.getFullYear();
        const month   = addLeadZero(date.getMonth() + 1);
        const day     = addLeadZero(date.getDate());
        const hours   = addLeadZero(date.getHours());
        const minutes = addLeadZero(date.getMinutes());
        
        return `${hours}:${minutes} ${day}.${month}.${year}`;
      }
      
      return (
          <Fragment>
            <div className={'time'}>
              {date()}
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Average</div>
              <div className={'data-value'}>{average}</div>
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Standard deviation</div>
              <div className={'data-value'}>{standartDeviation}</div>
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Mode</div>
              <div className={'data-value'}>{mode}</div>
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Median</div>
              <div className={'data-value'}>{median}</div>
            </div>
          </Fragment>
      );
    } else {
      return <div className={'empty'}>Waiting for data...</div>;
    }
  };
  
  return (
      <div className={'widget'}>
        {content()}
      </div>
  );
};

Widget.propTypes = {
  active: PropTypes.bool,
  data:   PropTypes.object,
};

Widget.defaultProps = {
  active: false,
};

export default Widget;