import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreator from '../../store/actions/index';

import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

class BurgerBuilder extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             purchasing: false,
        }
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map((igKey)=>{
            return ingredients[igKey]
        }).reduce((sum, el) => {
            return sum = sum + el;
        },0);

        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    purchaseCancelHandler = () =>{
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    componentDidMount = () => { 
        this.props.onInitIngredients();
    }
    

    render() {
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingrediwnt can't be loaded</p> : <Spinner />
        const disabledInfo = {
            ...this.props.ings
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        if(this.props.ings){
            burger = <Aux><Burger ingredients={this.props.ings} />
                <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded} 
                    ingredientRemoved={this.props.onIngredientRemoved} 
                    disabled={disabledInfo}
                    price={this.props.price}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}
                /></Aux>;
            
            orderSummary = <OrderSummary 
                ingredients={this.props.ings} 
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                total={this.props.price}
                />

        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
                
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings : state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded : (ingName) => dispatch(actionCreator.addIngredient(ingName)),
        onIngredientRemoved : (ingName) => dispatch(actionCreator.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actionCreator.initIngredients())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
