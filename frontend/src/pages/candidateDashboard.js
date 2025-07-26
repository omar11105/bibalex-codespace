import React from 'react';
import HeaderBar from '../components/Dashboard/HeaderBar';
import CurrentProblemCard from '../components/Dashboard/CurrentProblemCard';
import ProblemBankCard from '../components/Dashboard/ProblemBankCard';
import QuickActionsCard from '../components/Dashboard/QuickActionsCard';
import LeaderboardCard from '../components/Dashboard/LeaderboardCard';
import RecentSubmissionsCard from '../components/Dashboard/RecentSubmissionsCard';
import './candidateDashboard.css';

function Dashboard() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.id) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className='dashboard-container'>
      <HeaderBar user={user} />
      <div className='dashboard-content'>
        <div className='dashboard-main-grid'>
          <div className='dashboard-left-side'>
            <CurrentProblemCard />
            <div className='horizontal-divider'></div>
            <ProblemBankCard />
          </div>
          
          <div className='dashboard-divider'></div>
          
          <div className='dashboard-right-side'>
            <div className='dashboard-right-top'>
              <QuickActionsCard />
              <div className='vertical-divider-small'></div>
              <LeaderboardCard currentUser={user} />
            </div>
            <div className='horizontal-divider'></div>
            <RecentSubmissionsCard candidateId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;