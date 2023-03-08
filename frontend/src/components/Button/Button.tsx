import { css, StyleSheet } from 'aphrodite';
import React from 'react';

interface ButtonProps {
    children?: React.ReactNode;
    onClick: () => void;
    hidden?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    hidden
  }) => {
    const styles = StyleSheet.create({
      defaultButton: {
        border: '2px solid #FFFFFF',
        color: 'red',
        height: '50px',
        radius: '0%',
        width: '200px',
      },
    });

  return (
    <button
      onClick={onClick}
      className={css(styles.defaultButton)}
      hidden={hidden}
    >
    {children}
    </button>
  );
}

export default Button;