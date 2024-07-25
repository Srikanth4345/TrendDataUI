import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  const fetchData = () => {
    const requestData = {
      startDate: startDate,
      endDate: endDate
    };

    axios.post('https://localhost:7087/api/v1/devices', requestData)
      .then(response => {
        setData(response.data);
        setCurrentPage(1); // Reset to first page when fetching new data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const getLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    setStartDate(lastWeek.toISOString().substr(0, 10));
    setEndDate(today.toISOString().substr(0, 10));
    console.log(`Start Date (UTC): ${lastWeek.toISOString()}`);
    console.log(`End Date (UTC): ${today.toISOString()}`);
  };

  const getLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    setStartDate(lastMonth.toISOString().substr(0, 10));
    setEndDate(today.toISOString().substr(0, 10));
    console.log(`Start Date (UTC): ${lastMonth.toISOString()}`);
    console.log(`End Date (UTC): ${today.toISOString()}`);
  };

  const getLastDay = () => {
    const today = new Date();
    const lastDay = new Date(today);
    lastDay.setDate(lastDay.getDate() - 1);
    setStartDate(lastDay.toISOString().substr(0, 10));
    setEndDate(today.toISOString().substr(0, 10));
    console.log(`Start Date (UTC): ${lastDay.toISOString()}`);
    console.log(`End Date (UTC): ${today.toISOString()}`);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const today = new Date();
  const maxDate = today.toISOString().substr(0, 10);

  const handleStartDateChange = (e) => {
    const startDateString = e.target.value;
    setStartDate(startDateString);
    console.log(`Start Date: ${startDateString}`);
  };

  const handleEndDateChange = (e) => {
    const endDateString = e.target.value;
    setEndDate(endDateString);
    console.log(`End Date: ${endDateString}`);
  };

  const handleGoClick = () => {
    fetchData();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeviceClick = (deviceId) => {
    navigate(`/details/${deviceId}`, { state: { startDate, endDate } });
  };

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const renderPagination = () => {
    const paginationItems = [];
    for (let i = 1; i <= pageCount; i++) {
      paginationItems.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return paginationItems;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="dashboard-container">
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`bi ${isOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
        <nav>
          <ul className="dashboard-head">
            <i className="bi bi-speedometer"></i>
            {isOpen && <a href="/"> Dashboard</a>}
          </ul>
          <ul className="dashboard-head">
            <i className="bi bi-gear"></i>
            {isOpen && <a href="#settings"> Settings</a>}
          </ul>
          <ul className="dashboard-head">
            <i className="bi bi-box-arrow-left"></i>
            {isOpen && <a href="#logout"> Logout</a>}
          </ul>
        </nav>
      </aside>
      <div className={`dashboard-main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="dashboard-navbar">
          <h1>IOT PROJECT</h1>
          <i className="bi bi-person-circle"></i>
        </header>
        <div>
          <div className="dashboard-controls">
            <button onClick={getLastDay}>Last 1 Day</button>
            <button onClick={getLastWeek}>Last 7 Days</button>
            <button onClick={getLastMonth}>Last 1 Month</button>
          </div>
          <div className="dashboard-date-picker">
            <label>Start Date:</label>
            <input
              style={{ fontSize: "20px" }}
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              max={maxDate}
            />
            <label>End Date:</label>
            <input
              type="date"
              style={{ fontSize: "20px" }}
              value={endDate}
              onChange={handleEndDateChange}
              max={maxDate}
            />
            <button className="btn" onClick={handleGoClick}> Go </button>
          </div>
          <ul className="device-list">
            {currentData.map((item, index) => (
              <li key={index} className="device-container" onClick={() => handleDeviceClick(item.deviceId)}>
                <div className="device-info">
                  <span className="device-id">Device ID: {item.deviceId}</span>
                  <span className={`status ${item.status ? 'active' : 'inactive'}`}>
                    Status: {item.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePageChange.bind(null, currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <div className="pagination-numbers">
              <span>{currentPage}/{pageCount}</span>
            </div>
            <button onClick={handlePageChange.bind(null, currentPage + 1)} disabled={currentPage === pageCount}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
