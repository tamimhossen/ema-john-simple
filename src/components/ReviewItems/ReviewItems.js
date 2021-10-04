import React from 'react';

const ReviewItems = (props) => {
    const {name, quantity, key, price} = props.product;
    // console.log(props.product);
    const reviewItemsStyle = {
        borderBottom: '1px solid lightgray',
        marginBottom: '5px',
        paddingBottom: '5px',
        marginLeft: '200px'
    }
    return (
        <div style={reviewItemsStyle} className="review-item">
            <h4>{name}</h4>
            <p>Quantity: {quantity}</p>
            <p><small>$ {price}</small></p>
            <button onClick={() => props.removeProduct(key)} className="main-button">Remove</button>
        </div>
    );
};

export default ReviewItems;