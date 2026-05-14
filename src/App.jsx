import React from 'react'
import Dashboard from './pages/dashboard'

  return (
    <div>
      <Dashboard/>
    </div>
  )
}

      <div className="content">
        <div className="mapPanel">
          <MapView
            selected={selected}
            onPick={(place) => setSelected(place)}
          />
        </div>
      </div>
    </div>
  );
}