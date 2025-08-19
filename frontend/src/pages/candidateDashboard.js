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
    <div className='candidate-page'>
      <div className='candidate-dashboard-container'>
        <HeaderBar user={user} />
        <div className='candidate-dashboard-content'>
          <div className='candidate-dashboard-main-grid'>
            <div className='candidate-dashboard-left-side'>
              <CurrentProblemCard />
              <div className='candidate-horizontal-divider'></div>
              <ProblemBankCard />
            </div>
            
            <div className='candidate-dashboard-divider'></div>
            
            <div className='candidate-dashboard-right-side'>
              <div className='candidate-dashboard-right-top'>
                <QuickActionsCard />
                <div className='candidate-vertical-divider-small'></div>
                <LeaderboardCard currentUser={user} />
              </div>
              <div className='candidate-horizontal-divider'></div>
              <RecentSubmissionsCard candidateId={user?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;