import {Fragment, useState, useEffect} from 'react';
import PropTypes                       from 'prop-types';
import anime                           from 'animejs';
import './widget.scss';

function Widget(props) {
  const [avg, setAvg] = useState(0);
  const [sd, setSd]   = useState(0);
  const [mo, setMo]   = useState(0);
  const [me, setMe]   = useState(0);
  
  useEffect(() => {
    if (props.data) {
      const data = {avg, sd, mo, me};
      
      anime.remove(data);
      
      anime({
        targets:  data,
        avg:      props.data.avg,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setAvg(data.avg);
        },
      });
      
      anime({
        targets:  data,
        sd:       props.data.sd,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setSd(data.sd);
        },
      });
      
      anime({
        targets:  data,
        mo:       props.data.mo,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setMo(data.mo);
        },
      });
      
      anime({
        targets:  data,
        me:       props.data.me,
        round:    1,
        duration: 1000,
        easing:   'easeOutExpo',
        update:   anim => {
          setMe(data.me);
        },
      });
    }
    
    // Here react show annoying warning about add 'avg', 'sd', 'mo', 'me' in dependencies
    // but now everything work exactly how i want, so i just supress it.
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
              <div className={'data-value'}>{avg}</div>
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Standard deviation</div>
              <div className={'data-value'}>{sd}</div>
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Mode</div>
              <div className={'data-value'}>{mo}</div>
            </div>
            <div className={'data-box'}>
              <div className={'data-title'}>Median</div>
              <div className={'data-value'}>{me}</div>
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