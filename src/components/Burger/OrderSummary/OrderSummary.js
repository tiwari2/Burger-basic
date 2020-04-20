import React from 'react';
import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingrediantSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return <li key={igKey}>
                <span style={{ textTransform: 'capitalize' }}>
                    {igKey}
                </span>: {props.ingredients[igKey]}</li>
        });
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A Delicious burger with the following ingrediants:</p>
            <ul>
                {ingrediantSummary}
            </ul>
            <p>Continue to Checkout ?</p>
            <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
        </Aux>
    )
};

export default orderSummary;