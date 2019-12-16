import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-order';
import {connect} from 'react-redux';

import classes from './ContactData.css'
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreator from '../../../store/actions';

class ContactData extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             orderForm: {
                name:{
                    elementType: 'input',
                    elementConfig: {
                        type:"text",
                        placeholder: 'Your Name'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type:"text",
                        placeholder: 'Street'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false
                },
                zipCode: {
                    elementType: 'input',
                    elementConfig: {
                        type:"text",
                        placeholder: 'ZIP Code'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxlength: 5
                    },
                    valid: false,
                    touched: false
                },
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type:"text",
                        placeholder: 'Contry Name'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type:"email",
                        placeholder: 'Your E-Mail'
                    },
                    value: '',
                    validation: {
                        required: true,
                    },
                    valid: false,
                    touched: false
                },
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value: 'fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'}
                        ]
                    },
                    value: '',
                    valid: true,
                    validation: {}
                },
             },
             formIsValid: false
        }
    }

    orderhandler = (e) => {
        e.preventDefault();

        const formData={};
        for(let formElementIdentifier in this.state.orderForm)
        {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier]['value'];
        }
        const order = {
            ingredients : this.props.ings,
            price: this.props.price.toFixed(2),
            orderData: formData
        }
        this.props.onOrderBurger(order);

    }

    checkValidaty = (value, rules) => {


        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== '' && isValid
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {...this.state.orderForm}
        updatedOrderForm[inputIdentifier].value = event.target.value;
        updatedOrderForm[inputIdentifier].valid = this.checkValidaty(updatedOrderForm[inputIdentifier].value, updatedOrderForm[inputIdentifier].validation)
        updatedOrderForm[inputIdentifier].touched = true

        let formIsValid = true;
        for(let inputEleIdentifiers in updatedOrderForm){
            formIsValid = updatedOrderForm[inputEleIdentifiers].valid && formIsValid
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    }


    
    render() {

        const formElementArray = [];
        for(let key in this.state.orderForm){
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderhandler}>
                
                {
                    formElementArray.map(formElement => {
                        return (
                            <Input 
                                key={formElement.id}
                                elementType={formElement.config.elementType} 
                                elementConfig={formElement.config.elementConfig} 
                                value={formElement.config.value}
                                invalid={!formElement.config.valid}
                                shouldValidate = {formElement.config.validation}
                                touched = {formElement.config.touched}
                                changed={(event) => this.inputChangedHandler(event, formElement.id)}
                            />)
                    })
                }
                <Button btnType="Success" clicked={this.orderhandler} disabled={!this.state.formIsValid}>ORDER</Button>
                
            </form>
        );
        
        if(this.props.loading){
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

const mapStoreToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(actionCreator.purchaseBurger(orderData))
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))
