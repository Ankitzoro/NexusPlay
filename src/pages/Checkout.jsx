import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const STEPS = ['Address', 'Payment', 'Review'];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, discountedTotal, appliedCoupon, user } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'Required';
    if (!form.lastName) errs.lastName = 'Required';
    if (!form.email) errs.email = 'Required';
    if (!form.address) errs.address = 'Required';
    if (!form.city) errs.city = 'Required';
    if (!form.zip) errs.zip = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validate()) return;
    if (step === STEPS.length - 2) {
      navigate('/payment', { state: { form, total: discountedTotal } });
      return;
    }
    setStep((s) => s + 1);
  };

  const update = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-rajdhani transition-colors"
      >
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 className="font-orbitron text-2xl font-700 gradient-text mb-8">
        CHECKOUT
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="checkout-step">
              <div
                className={`step-number ${i < step ? 'step-done' : i === step ? 'step-active' : 'step-pending'}`}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span
                className={`font-orbitron text-xs ${i === step ? 'text-white' : 'text-slate-500'}`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-[#1e1e40] w-8 md:w-16" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-6">
              <h2 className="font-orbitron text-sm text-white mb-5 tracking-wider">
                BILLING ADDRESS
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    FIRST NAME
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    className="input-field"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    LAST NAME
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    className="input-field"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    EMAIL
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    ADDRESS
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    className="input-field"
                    placeholder="123 Main St"
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    CITY
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="input-field"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    STATE
                  </label>
                  <input
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="input-field"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    ZIP CODE
                  </label>
                  <input
                    value={form.zip}
                    onChange={(e) => update('zip', e.target.value)}
                    className="input-field"
                    placeholder="10001"
                  />
                  {errors.zip && (
                    <p className="text-red-400 text-xs mt-1">{errors.zip}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-orbitron mb-1.5 tracking-wider">
                    COUNTRY
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                    className="input-field"
                  >
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-5 h-fit">
          <h3 className="font-orbitron text-xs text-slate-400 mb-4 tracking-wider">
            ORDER SUMMARY
          </h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm font-rajdhani"
              >
                <span className="text-slate-300 line-clamp-1 flex-1 mr-2">
                  {item.name}
                </span>
                <span className="text-white shrink-0">
                  $
                  {item.discount
                    ? (item.price * (1 - item.discount / 100)).toFixed(2)
                    : item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1e1e40] pt-3 space-y-1.5">
            <div className="flex justify-between text-sm font-rajdhani">
              <span className="text-slate-400">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm font-rajdhani text-[#00ff88]">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-{appliedCoupon.discount}%</span>
              </div>
            )}
            <div className="flex justify-between font-orbitron text-sm text-white pt-1">
              <span>TOTAL</span>
              <span className="neon-cyan text-lg">
                ${discountedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full btn-primary mt-5 py-3 text-sm"
          >
            Continue to Payment <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
