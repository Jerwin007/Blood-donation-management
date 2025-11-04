import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ name: '', bloodGroup: '', phone: '', email: '', city: '' });
  const [donationForm, setDonationForm] = useState({ donorId: '', quantity: 1, date: '', location: '', notes: '' });
  const [donations, setDonations] = useState([]);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:7000';

  useEffect(() => {
    loadDonors();
    loadDonations();
  }, []);

  const loadDonors = () => {
    axios.get(`${API}/api/donors`).then(res => setDonors(res.data)).catch(err => console.log(err));
  };

  const loadDonations = () => {
    axios.get(`${API}/api/donations`).then(res => setDonations(res.data)).catch(err => console.log(err));
  };

  const addDonor = (e) => {
    e.preventDefault();
    axios.post(`${API}/api/donors`, form)
      .then(res => { setMessage(res.data.status); setForm({ name: '', bloodGroup: '', phone: '', email: '', city: '' }); loadDonors(); })
      .catch(err => setMessage('Error adding donor'));
  };

  const deleteDonor = (id) => {
    axios.post(`${API}/api/donors/delete`, { id })
      .then(res => { setMessage(res.data.status); loadDonors(); })
      .catch(err => setMessage('Error deleting donor'));
  };

  const addDonation = (e) => {
    e.preventDefault();
    axios.post(`${API}/api/donations`, donationForm)
      .then(res => { setMessage(res.data.status); setDonationForm({ donorId: '', quantity: 1, date: '', location: '', notes: '' }); loadDonations(); })
      .catch(err => setMessage('Error saving donation'));
  };

  return (
    <div className="container">
      <h1 className="mb-4">Blood Donation & Management Portal</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h4>Add Donor</h4>
            <form onSubmit={addDonor}>
              <input required className="form-control mb-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input required className="form-control mb-2" placeholder="Blood Group (e.g. A+)" value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} />
              <input className="form-control mb-2" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
              <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input className="form-control mb-2" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
              <button className="btn btn-primary">Add Donor</button>
            </form>
          </div>

          <div className="card p-3 mb-3">
            <h4>Record Donation</h4>
            <form onSubmit={addDonation}>
              <select required className="form-control mb-2" value={donationForm.donorId} onChange={e=>setDonationForm({...donationForm, donorId: e.target.value})}>
                <option value="">-- Select Donor --</option>
                {donors.map(d=> <option key={d._id} value={d._id}>{d.name} ({d.bloodGroup})</option>)}
              </select>
              <input required type="number" min="1" className="form-control mb-2" placeholder="Quantity (units)" value={donationForm.quantity} onChange={e=>setDonationForm({...donationForm,quantity: e.target.value})} />
              <input required type="date" className="form-control mb-2" value={donationForm.date} onChange={e=>setDonationForm({...donationForm,date: e.target.value})} />
              <input className="form-control mb-2" placeholder="Location" value={donationForm.location} onChange={e=>setDonationForm({...donationForm,location: e.target.value})} />
              <input className="form-control mb-2" placeholder="Notes" value={donationForm.notes} onChange={e=>setDonationForm({...donationForm,notes: e.target.value})} />
              <button className="btn btn-success">Save Donation</button>
            </form>
          </div>

        </div>

        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <h4>Donors</h4>
            <table className="table">
              <thead><tr><th>#</th><th>Name</th><th>Blood</th><th>City</th><th>Action</th></tr></thead>
              <tbody>
                {donors.length===0 ? <tr><td colSpan="5">No donors</td></tr> :
                  donors.map((d,i)=>(
                    <tr key={d._id}>
                      <td>{i+1}</td>
                      <td>{d.name}</td>
                      <td>{d.bloodGroup}</td>
                      <td>{d.city}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={()=>deleteDonor(d._id)}>Delete</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          <div className="card p-3">
            <h4>Donations</h4>
            <table className="table">
              <thead><tr><th>#</th><th>Donor</th><th>Qty</th><th>Date</th><th>Location</th></tr></thead>
              <tbody>
                {donations.length===0 ? <tr><td colSpan="5">No donations</td></tr> :
                  donations.map((dn,i)=>(
                    <tr key={dn._id}>
                      <td>{i+1}</td>
                      <td>{dn.donor?.name || '—'}</td>
                      <td>{dn.quantity}</td>
                      <td>{new Date(dn.date).toLocaleDateString()}</td>
                      <td>{dn.location}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div className="mt-3">
        {message && <div className="alert alert-info">{message}</div>}
      </div>
    </div>
  );
}
