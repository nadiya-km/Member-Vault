// pages/admin/member/AddMembership.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';


const AddMembership = () => {
  const { id } = useParams(); // memberId
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    planId: '',
    startDate: '',
    endDate: '',
    personalTrainer: '',
  });

  const [paymentType, setPaymentType] = useState(''); 

  useEffect(() => {
    fetchPlans();
    fetchTrainers();
  }, []);

  const fetchPlans = async () => {
    const res = await api.get('/membership-plans', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setPlans(res.data.data);
  };

  const fetchTrainers = async () => {
    const res = await api.get('/trainers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setTrainers(res.data.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentType) {
      alert('Please select payment type');
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/members/${id}/membership`,
        {
          ...formData,
          paymentType, 
          personalTrainer: formData.personalTrainer || null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      navigate(`/admin/members/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add membership');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Add Membership</h5>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* PLAN */}
              <div className="mb-3">
                <label className="form-label">Membership Plan</label>
                <select
                  name="planId"
                  className="form-select"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select Plan</option>
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — ₹{p.price} / {p.durationInMonths} month(s)
                    </option>
                  ))}
                </select>
              </div>

              {/* DATES */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* TRAINER */}
              <div className="mb-3">
                <label className="form-label">Personal Trainer (Optional)</label>
                <select
                  name="personalTrainer"
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">No Personal Trainer</option>
                  {trainers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PAYMENT TYPE */}
              <div className="mb-4">
                <label className="form-label">Payment Type</label>
                <select
                  className="form-select"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  required
                >
                  <option value="">Select Payment Type</option>
                  <option value="ONLINE">Online</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Membership'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMembership;
