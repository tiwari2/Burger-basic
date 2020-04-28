import React, { Component } from 'react';
import Aux from "../../hoc/Aux/Aux";
import Burger from '../../components/Burger/Burger';

import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICE = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false, //This moment Button False By Default
        purchasing: false,
        loading: false,
        error: false
    }

    /*------------------------------------------------
        Component Did Mount
    -------------------------------------------------*/
    componentDidMount() {
        axios.get('https://react-my-burger-dd0b5.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data })
            })
            .catch(error => {
                this.setState({ error: true });
            });
    }

    /* --------------------------------------------
        Update State For Button
    -----------------------------------------------*/
    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKeys => {
                // return For Each Keys from ingredients
                return ingredients[igKeys];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ purchasable: sum > 0 });
    }

    /*------------------------------------------
        To Add New Ingrediants 
    -------------------------------------------*/

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;

        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    /* ------------------------------------------------------
        Remove Ingrediants 
    ---------------------------------------------------------*/

    removeIngrediants = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;

        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    /*---------------------------------------------------------
      triggered Whenever click order now button
    ----------------------------------------------------------*/

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    /*-----------------------------------------------------------
        Performing BackDrop ( Closed Modal )
    ------------------------------------------------------------*/
    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    /*-----------------------------------------------------------
        Continuing Purchasing
    --------------------------------------------------------------*/

    purchaseContinueHandler = () => {
        this.setState({ loading: true });
        // alert('You continue');
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Harsh',
                address: {
                    street: 'Gwalior',
                    zipcode: '474004',
                    country: 'India'
                },
                email: 'tiwariharsh258@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false });
            });
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        // use For Spinner


        let burger = this.state.error ? <p>Ingrediants can't be loaded !</p> : <Spinner />
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngrediants}
                        disabled={disableInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>)
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <div>
                <Aux>
                    <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                        {orderSummary}
                    </Modal>
                    {burger}
                </Aux>
            </div>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);