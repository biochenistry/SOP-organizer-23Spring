import React from "react";

interface HeaderProps {
    text: string;
    color?: string;
    className?: string;
    renderAs: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    display?: 'block' | 'inline-block';
}

function Heading({ ...props }: HeaderProps) {
    let heading = React.createElement(props.renderAs, { 
      className: props.className,
      style: {
        display: props.display || 'block',
        color: props.color || 'inherit'
      }
    }, props.text);

    return (
      heading
    );
  }
  
export default Heading;