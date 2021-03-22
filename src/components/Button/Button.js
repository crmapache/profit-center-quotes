import {useRef, useEffect} from 'react';
import anime               from 'animejs';
import PropTypes           from 'prop-types';
import './button.scss';

function Button(props) {
  const ref       = useRef(null);
  const rippleRef = useRef(null);
  
  useEffect(() => {
    const button    = ref.current;
    const container = rippleRef.current;
    
    const handler = e => {
      const containerWidth  = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      const largestSide = containerWidth > containerHeight ? containerWidth : containerHeight;
      
      const x = e.clientX - button.getBoundingClientRect().x - (largestSide / 2);
      const y = e.clientY - button.getBoundingClientRect().y - (largestSide / 2);
      
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      ripple.style.top   = y + 'px';
      ripple.style.left  = x + 'px';
      ripple.style.width = ripple.style.height = largestSide + 'px';
      
      container.append(ripple);
      
      anime({
        targets:  ripple,
        opacity:  [.3, 0],
        scale:    [0, 2],
        duration: 400,
        easing:   'easeOutSine',
        complete: () => {
          ripple.remove();
        }
      });
    };
    
    button.addEventListener('click', handler);
    
    return () => {
      button.removeEventListener('click', handler);
    };
  }, [props]);
  
  function classes() {
    const classes = ['button'];
    
    if (props.disabled) {
      classes.push('disabled');
    }
    
    classes.push(props.color);
    
    return classes.join(' ');
  }
  
  function buttonClickhandler() {
    if (typeof props.click === 'function' && !props.disabled) {
      props.click();
    }
  }
  
  return (
      <div className={classes()} onClick={buttonClickhandler} ref={ref}>
        {props.title}
        <div className={'ripple-container'} ref={rippleRef}></div>
      </div>
  );
};

Button.propTypes = {
  title:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color:    PropTypes.oneOf(['primary', 'error', 'success']),
  click:    PropTypes.func,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  title:    'Button',
  color:    'primary',
  disabled: false,
};

export default Button;