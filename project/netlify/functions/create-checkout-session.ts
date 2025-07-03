import { Handler } from '@netlify/functions';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { planId, isAnnual, userId, userEmail } = JSON.parse(event.body || '{}');

    // Your actual Price IDs from Stripe
    const priceIds = {
      '3day': isAnnual ? 'price_1RgqFKEfIIaED3yLd1QJ0lw0' : 'price_1RgqCiEfIIaED3yLtTxEj1cE',
      '5day': isAnnual ? 'price_1RgqFKEfIIaED3yLd1QJ0lw0' : 'price_1RgqD9EfIIaED3yLhbdRESkJ',
      '7day': isAnnual ? 'price_1RgqFKEfIIaED3yLd1QJ0lw0' : 'price_1RgqDbEfIIaED3yLjttObvu2',
    };

    const priceId = priceIds[planId as keyof typeof priceIds];
    
    if (!priceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid plan ID' })
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        userId: userId,
        planId: planId,
        isAnnual: isAnnual.toString()
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planId: planId
        }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id })
    };

  } catch (error) {
    console.error('Stripe session creation failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
