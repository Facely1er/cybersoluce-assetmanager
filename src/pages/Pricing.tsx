import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, Building2, Database, BarChart3, Users, Lock, Cloud } from 'lucide-react';
import { PRODUCTS, ONE_TIME_PRODUCTS, ANNUAL_DISCOUNT, getCheckoutConfig, getOneTimeCheckoutConfig } from '../config/stripe';
import { stripeClient } from '../lib/stripe';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planKey: keyof typeof PRODUCTS, isOneTime = false) => {
    try {
      setLoading(planKey);
      
      if (isOneTime) {
        const config = getOneTimeCheckoutConfig(planKey as keyof typeof ONE_TIME_PRODUCTS);
        const { url } = await stripeClient.createCheckoutSession({
          priceId: ONE_TIME_PRODUCTS[planKey as keyof typeof ONE_TIME_PRODUCTS].priceId,
          successUrl: config.successUrl,
          cancelUrl: config.cancelUrl,
          metadata: config.metadata,
        });
        window.location.href = url;
      } else {
        const isAnnual = billingPeriod === 'annual';
        const config = getCheckoutConfig(planKey, isAnnual);
        const { url } = await stripeClient.createCheckoutSession({
          priceId: PRODUCTS[planKey].priceId!,
          successUrl: config.successUrl,
          cancelUrl: config.cancelUrl,
          metadata: config.metadata,
        });
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const calculateAnnualPrice = (monthlyPrice: number): number => {
    return Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Asset Management Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive asset inventory and risk management solutions for organizations of all sizes.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                Save {Math.round(ANNUAL_DISCOUNT * 100)}%
              </span>
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {PRODUCTS.free.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                ${PRODUCTS.free.price}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">forever</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {PRODUCTS.free.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRODUCTS.free.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-blue-500 dark:border-blue-600 p-8 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {PRODUCTS.professional.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                ${billingPeriod === 'annual' ? (calculateAnnualPrice(PRODUCTS.professional.price) / 12).toFixed(2) : PRODUCTS.professional.price}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {billingPeriod === 'annual' ? 'per month (billed annually)' : 'per month'}
              </p>
              {billingPeriod === 'annual' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ${calculateAnnualPrice(PRODUCTS.professional.price)}/year (save ${(PRODUCTS.professional.price * 12 - calculateAnnualPrice(PRODUCTS.professional.price)).toFixed(2)})
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {PRODUCTS.professional.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRODUCTS.professional.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('professional')}
              disabled={loading === 'professional'}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'professional' ? 'Loading...' : 'Start Professional'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {PRODUCTS.enterprise.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                ${billingPeriod === 'annual' ? (calculateAnnualPrice(PRODUCTS.enterprise.price) / 12).toFixed(2) : PRODUCTS.enterprise.price}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {billingPeriod === 'annual' ? 'per month (billed annually)' : 'per month'}
              </p>
              {billingPeriod === 'annual' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ${calculateAnnualPrice(PRODUCTS.enterprise.price)}/year (save ${(PRODUCTS.enterprise.price * 12 - calculateAnnualPrice(PRODUCTS.enterprise.price)).toFixed(2)})
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {PRODUCTS.enterprise.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRODUCTS.enterprise.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('enterprise')}
              disabled={loading === 'enterprise'}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'enterprise' ? 'Loading...' : 'Contact Sales'}
            </button>
          </div>
        </div>

        {/* One-Time Products */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            One-Time Purchase Tools
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Offline asset management tools. No subscription required, lifetime access.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                  <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {ONE_TIME_PRODUCTS.assetToolkit.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  ${ONE_TIME_PRODUCTS.assetToolkit.price}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">one-time payment</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {ONE_TIME_PRODUCTS.assetToolkit.description}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {ONE_TIME_PRODUCTS.assetToolkit.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('assetToolkit', true)}
                disabled={loading === 'assetToolkit'}
                className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'assetToolkit' ? 'Loading...' : 'Purchase Now'}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I start with the free plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! The free plan includes up to 50 assets and basic features. Perfect for small teams 
                getting started with asset management.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What's included in Professional?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Professional includes unlimited assets, advanced risk analysis, compliance reporting, 
                API access, and up to 10 team members. Perfect for growing organizations.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can cancel your subscription at any time. Your data will remain accessible, 
                and you'll continue to have access to all free features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

