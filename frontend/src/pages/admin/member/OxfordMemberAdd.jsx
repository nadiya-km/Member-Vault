import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const OxfordMemberAdd = () => {
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        age: '',
        personalTrainer: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const res = await api.get('/trainers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTrainers(res.data.data);
        } catch (err) {
            console.error('Failed to load trainers');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(
                '/members',
                {
                    ...formData,
                    personalTrainer: formData.personalTrainer || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            alert('Member added successfully!');
            navigate('/admin/members');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="oxford-page-wrapper">
            <div className="container-oxford">
                <div className="oxford-card">
                    <div className="card-body">
                        <h2 className="oxford-title">Add New Member</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="oxford-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="oxford-input"
                                    placeholder="Enter member's full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="oxford-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="oxford-input"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="oxford-label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="oxford-input"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="oxford-label">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        name="whatsappNumber"
                                        className="oxford-input"
                                        placeholder="Enter WhatsApp number"
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="oxford-label">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        className="oxford-input"
                                        placeholder="Enter age"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="oxford-label">Personal Trainer</label>
                                    <select
                                        name="personalTrainer"
                                        className="oxford-select"
                                        value={formData.personalTrainer}
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
                            </div>

                            <div className="section-gap d-flex gap-3">
                                <button
                                    type="button"
                                    className="btn-oxford-secondary"
                                    onClick={() => navigate('/admin/members')}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-oxford-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OxfordMemberAdd;
