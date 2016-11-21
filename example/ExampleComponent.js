import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
} from 'react-native';

import Form from 'react-native-osd-form';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 0,
    },
});

export default class Example extends Component {

    validateEmail = (email = '') => {
        const re = /^([\w-\+]+(?:\.[\w-\+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        return re.test(email);
    }

    validatePassword = (password = '') => {
        return (password && password.length >= 8);
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                <Form
                    inputs={[
                        {
                            type: 'email',
                            name: 'email',
                            label: 'Email',
                        },
                        {
                            type: 'password',
                            name: 'password',
                            label: 'Password',
                        },
                        {
                            type: 'textarea',
                            name: 'description',
                            label: 'Description',
                        },
                        { type: 'separator' },
                        {
                            type: 'checkbox',
                            name: 'terms',
                            label: 'Terms and Conditions',
                        },
                        {
                            type: 'checkboxes',
                            name: 'choice',
                            label: 'Choose some stuff',
                            options: [
                                {
                                    label: 'Item 1',
                                    value: 'item-1',
                                },
                                {
                                    label: 'Item 2',
                                    value: 'item-2',
                                },
                                {
                                    label: 'Item 3',
                                    value: 'item-3',
                                },
                            ],
                        },
                        { type: 'separator' },
                        {
                            type: 'datetime',
                            name: 'datetime',
                            label: 'What date and time is it?',
                        },
                        {
                            type: 'date',
                            name: 'date',
                            label: 'What date is it?',
                        },
                        {
                            type: 'time',
                            name: 'time',
                            label: 'What time is it?',
                        },
                        {
                            type: 'submit',
                            text: 'Send',
                        },
                    ]}
                />
                <Form
                    formGroups={[
                        {
                            inputs: [
                                {
                                    type: 'email',
                                    name: 'email',
                                    label: 'Email',
                                    validationFunctions: [
                                        this.validateEmail,
                                    ],
                                    validationErrorMessages: [
                                        'Email is not valid',
                                    ],
                                },
                                {
                                    type: 'password',
                                    name: 'password',
                                    label: 'Password',
                                    validationFunctions: [
                                        this.validatePassword,
                                    ],
                                    validationErrorMessages: [
                                        'Password is not valid, it should have at least 8 characters',
                                    ],
                                },
                            ],
                        },
                        {
                            inputs: [
                                {
                                    type: 'submit',
                                    text: 'Send',
                                },
                            ],
                        },
                    ]}
                />
                <Form
                    displayErrorsGlobally
                    formGroups={[
                        {
                            inputs: [
                                {
                                    type: 'email',
                                    name: 'email',
                                    label: 'Email',
                                    validationFunctions: [
                                        this.validateEmail,
                                    ],
                                    validationErrorMessages: [
                                        'Email is not valid',
                                    ],
                                },
                                {
                                    type: 'password',
                                    name: 'password',
                                    label: 'Password',
                                    validationFunctions: [
                                        this.validatePassword,
                                    ],
                                    validationErrorMessages: [
                                        'Password is not valid, it should have at least 8 characters',
                                    ],
                                },
                            ],
                        },
                        {
                            inputs: [
                                {
                                    type: 'submit',
                                    text: 'Send',
                                },
                            ],
                        },
                    ]}
                />
            </ScrollView>
        );
    }
}
