import React from 'react';
import View from '../components/View/View';
import Heading from '../components/Heading/Heading';
import Paragraph from '../components/Paragraph/Paragraph';
import { Link, useLocation } from 'react-router-dom';

export default function DevCredit() {
    return (
        <View container width='100%' flexDirection='column' height='100%' padding='16px' gap='16px' >
            <Heading renderAs='h1' text='Developer Info' fontWeight='bold' />
            <Heading renderAs='h3' text='Spring 2023 402 Group 11:' />
            <View container flexDirection='column' padding='8px' gap='8px' >
                <Paragraph> Evan Lewis</Paragraph>
                <Paragraph> Evan McClure</Paragraph>
                <Paragraph> Molly Carrick</Paragraph>
                <Paragraph> Tyler Evans</Paragraph>
                <Paragraph> Grant Bielecki</Paragraph>
                <Link to={'https://seniord.cs.iastate.edu/2023-Jan-11/'}>
                    <Paragraph> Senior Design Website</Paragraph>
                </Link>
            </View>
        </View>
    );
}