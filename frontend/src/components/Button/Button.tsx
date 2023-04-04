import { css, CSSProperties, StyleSheet } from 'aphrodite';
import React from 'react';
import { Colors } from '../GlobalStyles';
import { useNavigate } from 'react-router';
import { createStyle } from '../../util/createStyle';
import Paragraph from '../Paragraph/Paragraph';
import LoadingSpinner from '../LoadingSpinner';
import View from '../View/View';

interface ButtonProps {
  onClick?: (() => void) | (() => Promise<void>);
  href?: string;
  label?: string;
  variant: 'primary' | 'secondary';
  onDark?: boolean;
  type?: 'button' | 'submit';
  style?: CSSProperties;
  hidden?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const styles = StyleSheet.create({
  default: {
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  primary: {
    backgroundColor: Colors.isuRed,
    color: '#ffffff',
    height: '40px',
    padding: '0 24px',
    ':hover': {
      boxShadow: `0 0 0 1px #fff,0 0 0 3px ${Colors.isuRed}`,
    },
    ':active': {
      backgroundColor: Colors.isuRedDark,
      boxShadow: `0 0 0 1px #fff,0 0 0 3px ${Colors.isuRedDark}`,
    },
  },
  secondary: {
    backgroundColor: 'inherit',
    border: `2px solid ${Colors.isuRed}`,
    color: Colors.isuRed,
    height: '40px',
    padding: '0 24px',
    ':hover': {
      backgroundColor: Colors.isuRedLight,
    },
    ':active': {
      borderColor: Colors.isuRedDark,
      borderWidth: '3px',
      color: Colors.isuRedDark,
      padding: '0 23px',
    },
  },
  primaryOnDark: {
    backgroundColor: Colors.isuYellow,
    height: '40px',
    padding: '0 24px',
    ':hover': {
      boxShadow: `0 0 0 1px ${Colors.isuRed},0 0 0 3px ${Colors.isuYellow}`,
    },
    ':active': {
      backgroundColor: Colors.isuYellowDark,
      boxShadow: `0 0 0 1px ${Colors.isuRed},0 0 0 3px ${Colors.isuYellowDark}`,
    },
  },
  secondaryOnDark: {
    backgroundColor: 'inherit',
    border: `2px solid ${Colors.isuYellow}`,
    color: Colors.isuYellow,
    height: '40px',
    padding: '0 24px',
    ':hover': {
      borderWidth: '3px',
      padding: '0 23px',
    },
    ':active': {
      borderColor: Colors.isuYellowDark,
      color: Colors.isuYellowDark,
    },
  },
});

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant,
  href,
  onDark,
  type,
  style,
  hidden,
  disabled,
  isLoading,
}) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (onClick) {
      await onClick();
    }

    if (href) {
      navigate(href);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={css(styles.default, getButtonStyle(variant, onDark), createStyle(style))}
      type={type}
      hidden={hidden}
      disabled={disabled}
    >
      <View container alignItems='center' justifyContent='center' style={{ position: 'relative', left: 0, top: 0, ...(isLoading ? { height: '100%' } : {}) }}>
        {isLoading && <LoadingSpinner size='small' />}
      </View>
      <Paragraph style={{ color: 'inherit', textAlign: 'center', ...(isLoading ? { visibility: 'hidden' } : {}) }}>{label}</Paragraph>
    </button>
  );
}

const getButtonStyle = (variant: 'primary' | 'secondary', onDark?: boolean) => {
  if (onDark) {
    if (variant === 'primary') {
      return styles.primaryOnDark;
    } else {
      return styles.secondaryOnDark;
    }
  } else {
    if (variant === 'primary') {
      return styles.primary;
    } else {
      return styles.secondary;
    }
  }
}

export default Button;