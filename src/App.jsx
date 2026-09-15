import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import f1Logo from './assets/f1-logo.svg';

const DRIVER_STANDINGS_URL = 'https://api.jolpi.ca/ergast/f1/current/driverstandings.json';
const CONSTRUCTOR_STANDINGS_URL = 'https://api.jolpi.ca/ergast/f1/current/constructorstandings.json';
const RACE_CALENDAR_URL = 'https://api.jolpi.ca/ergast/f1/current.json';
const REFRESH_INTERVAL_MS = 30000;
const TELEMETRY_TICK_MS = 3000;
const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

const CIRCUIT_TRACK_MAPS = {
  albert_park: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Albert_Park_Circuit_2021.svg/640px-Albert_Park_Circuit_2021.svg.png',
  shanghai: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Shanghai_International_Racing_Circuit_track_map.svg/640px-Shanghai_International_Racing_Circuit_track_map.svg.png',
  suzuka: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Suzuka_circuit_map--2018.svg/640px-Suzuka_circuit_map--2018.svg.png',
  miami: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Miami_International_Autodrome.svg/640px-Miami_International_Autodrome.svg.png',
  villeneuve: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Circuit_Gilles_Villeneuve.svg/640px-Circuit_Gilles_Villeneuve.svg.png',
  monaco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Circuit_Monaco_2015.svg/640px-Circuit_Monaco_2015.svg.png',
  catalunya: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Circuit_de_Barcelona-Catalunya_2023.svg/640px-Circuit_de_Barcelona-Catalunya_2023.svg.png',
  red_bull_ring: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Red_Bull_Ring.svg/640px-Red_Bull_Ring.svg.png',
  silverstone: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Silverstone_Circuit_2020.svg/640px-Silverstone_Circuit_2020.svg.png',
  spa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/640px-Spa-Francorchamps_of_Belgium.svg.png',
  hungaroring: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hungaroring.svg/640px-Hungaroring.svg.png',
  zandvoort: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Circuit_Zandvoort.svg/640px-Circuit_Zandvoort.svg.png',
  monza: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Monza_track_map.svg/640px-Monza_track_map.svg.png',
  baku: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Baku_City_Circuit.svg/640px-Baku_City_Circuit.svg.png',
  sepang: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Sepang_International_Circuit.svg/640px-Sepang_International_Circuit.svg.png',
  marina_bay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Marina_Bay_Street_Circuit.svg/640px-Marina_Bay_Street_Circuit.svg.png',
  americas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Circuit_of_the_Americas.svg/640px-Circuit_of_the_Americas.svg.png',
  rodriguez: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez.svg/640px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez.svg.png',
  interlagos: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace.svg/640px-Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace.svg.png',
  vegas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Las_Vegas_Street_Circuit.svg/640px-Las_Vegas_Street_Circuit.svg.png',
  losail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Losail_International_Circuit.svg/640px-Losail_International_Circuit.svg.png',
  yas_marina: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Yas_Marina_Circuit.svg/640px-Yas_Marina_Circuit.svg.png',
};

const TEAM_META = {
  Mercedes: { engine: 'Mercedes', base: 'Brackley, UK', color: '#00d2be' },
  Ferrari: { engine: 'Ferrari', base: 'Maranello, Italy', color: '#dc0000' },
  McLaren: { engine: 'Mercedes', base: 'Woking, UK', color: '#ff8700' },
  'Red Bull': { engine: 'Honda RBPT', base: 'Milton Keynes, UK', color: '#1e41ff' },
  'Red Bull Racing': { engine: 'Honda RBPT', base: 'Milton Keynes, UK', color: '#1e41ff' },
  'RB F1 Team': { engine: 'Honda RBPT', base: 'Faenza, Italy', color: '#6692ff' },
  'Alpine F1 Team': { engine: 'Renault', base: 'Enstone, UK', color: '#0090ff' },
  Alpine: { engine: 'Renault', base: 'Enstone, UK', color: '#0090ff' },
  'Haas F1 Team': { engine: 'Ferrari', base: 'Kannapolis, USA', color: '#b6babd' },
  Audi: { engine: 'Audi', base: 'Hinwil, Switzerland', color: '#ff0000' },
  Williams: { engine: 'Mercedes', base: 'Grove, UK', color: '#005aff' },
  'Aston Martin': { engine: 'Mercedes', base: 'Silverstone, UK', color: '#006f62' },
  'Cadillac F1 Team': { engine: 'Ferrari', base: 'Silverstone, UK', color: '#000000' },
};

const NATIONALITY_CODES = {
  British: 'GBR',
  Dutch: 'NED',
  Monegasque: 'MON',
  Australian: 'AUS',
  Spanish: 'ESP',
  Mexican: 'MEX',
  French: 'FRA',
  Italian: 'ITA',
  German: 'GER',
  Brazilian: 'BRA',
  Canadian: 'CAN',
  Thai: 'THA',
  Finnish: 'FIN',
  'New Zealander': 'NZL',
  Argentine: 'ARG',
  American: 'USA',
  Austrian: 'AUT',
};

function getTeamColor(team) {
  return TEAM_META[team]?.color ?? '#888888';
}

function nationalityCode(nationality) {
  return NATIONALITY_CODES[nationality] ?? nationality.slice(0, 3).toUpperCase();
}

function mapDriversFromApi(standings) {
  return standings.map((item) => {
    const team = item.Constructors[0]?.name ?? 'Unknown';
    const wins = Number(item.wins);
    const position = Number(item.position);

    return {
      id: item.Driver.driverId,
      code: item.Driver.code,
      name: `${item.Driver.givenName} ${item.Driver.familyName}`,
      team,
      points: Number(item.points),
      wins,
      topSpeed: +(338 + (22 - position) * 0.75).toFixed(1),
      qualifyingRank: position,
      nationality: nationalityCode(item.Driver.nationality),
      number: Number(item.Driver.permanentNumber) || 0,
      position,
    };
  });
}

function mapConstructorsFromApi(constructorStandings, drivers) {
  return constructorStandings.map((item) => {
    const name = item.Constructor.name;
    const meta = TEAM_META[name] ?? { engine: '—', base: item.Constructor.nationality };
    const teamDrivers = drivers.filter((d) => d.team === name).map((d) => d.name);

    return {
      id: item.Constructor.constructorId,
      name,
      drivers: teamDrivers,
      points: Number(item.points),
      wins: Number(item.wins),
      engine: meta.engine,
      base: meta.base,
    };
  });
}

async function fetchStandings() {
  const [driverRes, constructorRes] = await Promise.all([
    fetch(DRIVER_STANDINGS_URL),
    fetch(CONSTRUCTOR_STANDINGS_URL),
  ]);

  if (!driverRes.ok || !constructorRes.ok) {
    throw new Error('Failed to fetch F1 standings');
  }

  const driverData = await driverRes.json();
  const constructorData = await constructorRes.json();

  const driverList =
    driverData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
  const constructorList =
    constructorData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];

  const driversBase = mapDriversFromApi(driverList);
  const constructorsBase = mapConstructorsFromApi(constructorList, driversBase);

  return {
    drivers: driversBase,
    constructors: constructorsBase,
    season: driverData.MRData.StandingsTable.season,
    round: driverData.MRData.StandingsTable.round,
  };
}

function tickTelemetrySpeed(prevDrivers) {
  return prevDrivers.map((driver) => {
    const speedDelta = (Math.random() - 0.5) * 0.8;
    return {
      ...driver,
      topSpeed: Math.min(355, Math.max(335, +(driver.topSpeed + speedDelta).toFixed(1))),
    };
  });
}

function projectLatLng(lat, lng, width = MAP_WIDTH, height = MAP_HEIGHT) {
  return {
    x: ((Number(lng) + 180) / 360) * width,
    y: ((90 - Number(lat)) / 180) * height,
  };
}

function mapRacesFromApi(races, currentRound) {
  const roundNum = Number(currentRound);
  return races.map((race) => {
    const lat = Number(race.Circuit.Location.lat);
    const lng = Number(race.Circuit.Location.long);
    const round = Number(race.round);
    let status = 'upcoming';
    if (round < roundNum) status = 'completed';
    else if (round === roundNum) status = 'current';

    return {
      id: race.Circuit.circuitId,
      round,
      raceName: race.raceName,
      circuitName: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
      lat,
      lng,
      date: race.date,
      time: race.time ?? '',
      status,
      coords: projectLatLng(lat, lng),
      trackMap: CIRCUIT_TRACK_MAPS[race.Circuit.circuitId] ?? null,
      wikiUrl: race.Circuit.url,
    };
  });
}

async function fetchRaceCalendar(currentRound) {
  const res = await fetch(RACE_CALENDAR_URL);
  if (!res.ok) throw new Error('Failed to fetch race calendar');
  const data = await res.json();
  const races = data.MRData.RaceTable.Races ?? [];
  return mapRacesFromApi(races, currentRound);
}

function formatRaceDate(date, time) {
  const dt = new Date(time ? `${date}T${time}` : date);
  return dt.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getOsmEmbedUrl(lat, lng) {
  const pad = 0.08;
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function App() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [season, setSeason] = useState('');
  const [round, setRound] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('drivers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [races, setRaces] = useState([]);
  const [calendarError, setCalendarError] = useState(null);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [pulse, setPulse] = useState(false);
  const refreshInFlight = useRef(false);

  const loadStandings = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;

    try {
      const data = await fetchStandings();
      setDrivers(data.drivers);
      setConstructors(data.constructors);
      setSeason(data.season);
      setRound(data.round);
      setLastUpdated(new Date());
      setError(null);
      setSelectedDriver((selected) =>
        selected ? data.drivers.find((d) => d.id === selected.id) ?? null : null
      );
      try {
        setCalendarError(null);
        const calendar = await fetchRaceCalendar(data.round);
        setRaces(calendar);
        setSelectedCircuit((prev) => {
          if (prev) return calendar.find((r) => r.id === prev.id) ?? prev;
          return (
            calendar.find((r) => r.status === 'current') ??
            calendar.find((r) => r.status === 'upcoming') ??
            calendar[calendar.length - 1] ??
            null
          );
        });
      } catch (calendarFetchError) {
        setCalendarError(calendarFetchError.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      refreshInFlight.current = false;
      setLoading(false);
    }
  }, []);

  const teams = useMemo(() => ['All', ...new Set(drivers.map((d) => d.team))], [drivers]);

  const filteredDrivers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return drivers.filter((driver) => {
      const matchesSearch =
        !query ||
        driver.name.toLowerCase().includes(query) ||
        driver.team.toLowerCase().includes(query);
      const matchesTeam = selectedTeam === 'All' || driver.team === selectedTeam;
      return matchesSearch && matchesTeam;
    }).sort((a, b) => b.points - a.points);
  }, [searchQuery, selectedTeam, drivers]);

  const sortedConstructors = useMemo(
    () => [...constructors].sort((a, b) => b.points - a.points),
    [constructors]
  );

  const mapRoutePoints = useMemo(
    () => races.map((r) => `${r.coords.x},${r.coords.y}`).join(' '),
    [races]
  );

  const stats = useMemo(() => {
    if (!drivers.length) return { totalPoints: 0, totalWins: 0, leader: { name: '—', points: 0 } };
    const totalPoints = drivers.reduce((sum, d) => sum + d.points, 0);
    const totalWins = drivers.reduce((sum, d) => sum + d.wins, 0);
    const leader = [...drivers].sort((a, b) => b.points - a.points)[0];
    return { totalPoints, totalWins, leader };
  }, [drivers]);

  useEffect(() => {
    const initialLoad = setTimeout(loadStandings, 0);
    const interval = setInterval(loadStandings, REFRESH_INTERVAL_MS);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [loadStandings]);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers((prev) => {
        const next = tickTelemetrySpeed(prev);
        setSelectedDriver((selected) =>
          selected ? next.find((d) => d.id === selected.id) ?? null : null
        );
        return next;
      });
    }, TELEMETRY_TICK_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedDriver(null);
        setSelectedCircuit(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDriverClick = (driver) => {
    setSelectedDriver((prev) => (prev?.id === driver.id ? null : driver));
  };

  const handleCircuitClick = (circuit) => {
    setSelectedCircuit((prev) => (prev?.id === circuit.id ? null : circuit));
  };

  if (loading) {
    return (
      <div className="f1-app f1-app--centered min-h-screen bg-[#0a0a0c] text-[#e8e8e8] flex items-center justify-center font-body text-xl tracking-[0.1em]">
        <style>{`
          .f1-app--centered {
            min-height: 100vh;
            background: #0a0a0c;
            color: #e8e8e8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.25rem;
            letter-spacing: 0.1em;
          }
        `}</style>
        Loading live F1 data...
      </div>
    );
  }

  if (error && !drivers.length) {
    return (
      <div className="f1-app f1-app--centered min-h-screen bg-[#0a0a0c] text-[#ff4d4d] flex flex-col items-center justify-center gap-4 p-8 font-body">
        <style>{`
          .f1-app--centered {
            min-height: 100vh;
            background: #0a0a0c;
            color: #ff4d4d;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-family: 'Rajdhani', sans-serif;
            padding: 2rem;
          }
          .f1-app__retry {
            background: #e10600;
            border: none;
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
        `}</style>
        <p>Error: {error}</p>
        <button className="f1-app__retry bg-[#e10600] border-0 text-white px-6 py-3 rounded cursor-pointer text-base" onClick={loadStandings}>Retry</button>
      </div>
    );
  }

  return (
    <div className="f1-app min-h-screen bg-[#0a0a0c] text-[#e8e8e8] font-body p-8 max-[640px]:p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .f1-app {
          min-height: 100vh;
          background: #0a0a0c;
          background-image:
            radial-gradient(ellipse at 20% 0%, rgba(225, 6, 0, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(0, 255, 200, 0.06) 0%, transparent 50%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(255, 255, 255, 0.015) 80px,
              rgba(255, 255, 255, 0.015) 81px
            );
          color: #e8e8e8;
          font-family: 'Rajdhani', sans-serif;
          padding: 2rem;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(225, 6, 0, 0.4);
        }

        .header__brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header__logo {
          height: 44px;
          width: auto;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(225, 6, 0, 0.45));
        }

        .header__title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .header__title span {
          color: #e10600;
        }

        .header__subtitle {
          font-size: 0.95rem;
          color: #888;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .header__updated {
          font-size: 0.8rem;
          color: #555;
          letter-spacing: 0.08em;
          margin-top: 0.35rem;
        }

        .value--live {
          animation: valueFlash 0.6s ease;
        }

        @keyframes valueFlash {
          0% { color: #fff; text-shadow: 0 0 8px rgba(0, 255, 200, 0.6); }
          100% { color: inherit; text-shadow: none; }
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(225, 6, 0, 0.15);
          border: 1px solid rgba(225, 6, 0, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .live-badge__dot {
          width: 8px;
          height: 8px;
          background: #e10600;
          border-radius: 50%;
          box-shadow: 0 0 8px #e10600;
          transition: opacity 0.6s;
        }

        .live-badge__dot--pulse { opacity: 0.3; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(145deg, #141418, #1a1a20);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-left: 3px solid #e10600;
          padding: 1.25rem;
          border-radius: 6px;
        }

        .stat-card__label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.4rem;
        }

        .stat-card__value {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
        }

        .stat-card__value--accent { color: #00ffc8; }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tab {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.75rem 1.5rem;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #888;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .tab:hover { border-color: rgba(225, 6, 0, 0.4); color: #ccc; }

        .tab--active {
          background: linear-gradient(135deg, rgba(225, 6, 0, 0.25), rgba(225, 6, 0, 0.1));
          border-color: #e10600;
          color: #fff;
          box-shadow: 0 0 15px rgba(225, 6, 0, 0.2);
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .search-input {
          flex: 1;
          min-width: 220px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #e10600;
          box-shadow: 0 0 10px rgba(225, 6, 0, 0.15);
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .search-wrapper::before {
          content: '⌕';
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #555;
          font-size: 1.1rem;
        }

        .team-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .team-chip {
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 600;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          color: #aaa;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .team-chip:hover { border-color: rgba(255, 255, 255, 0.2); color: #fff; }

        .team-chip--active {
          border-color: var(--chip-color, #e10600);
          color: #fff;
          background: color-mix(in srgb, var(--chip-color, #e10600) 20%, transparent);
          box-shadow: 0 0 10px color-mix(in srgb, var(--chip-color, #e10600) 30%, transparent);
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1100px) {
          .main-grid { grid-template-columns: 1fr 360px; }
        }

        .panel {
          background: linear-gradient(145deg, #111114, #18181e);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          overflow: hidden;
        }

        .panel__header {
          padding: 1rem 1.25rem;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-family: 'Orbitron', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ccc;
        }

        .table-wrap { overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead th {
          padding: 0.85rem 1rem;
          text-align: left;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #555;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        tbody tr {
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        tbody tr:hover { background: rgba(225, 6, 0, 0.06); }

        tbody tr.row--selected {
          background: rgba(225, 6, 0, 0.12);
          border-left: 3px solid #e10600;
        }

        tbody td {
          padding: 0.9rem 1rem;
          font-size: 1rem;
        }

        .pos {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #666;
          width: 40px;
        }

        .pos--p1 { color: #ffd700; }
        .pos--p2 { color: #c0c0c0; }
        .pos--p3 { color: #cd7f32; }

        .driver-name {
          font-weight: 700;
          font-size: 1.05rem;
        }

        .team-badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 3px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: color-mix(in srgb, var(--team-color) 25%, transparent);
          border: 1px solid var(--team-color);
          color: var(--team-color);
        }

        .points {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          color: #00ffc8;
        }

        .podium-count {
          color: #aaa;
        }

        .telemetry-card {
          padding: 1.5rem;
          animation: slideIn 0.25s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .telemetry-card__empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: #555;
        }

        .telemetry-card__empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          opacity: 0.4;
        }

        .telemetry-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .telemetry-card__number {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.08);
          line-height: 1;
        }

        .telemetry-card__name {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .telemetry-card__team {
          font-size: 0.9rem;
          color: #888;
          margin-top: 0.2rem;
        }

        .telemetry-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .telemetry-stat {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 1rem;
        }

        .telemetry-stat__label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #555;
          margin-bottom: 0.35rem;
        }

        .telemetry-stat__value {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .telemetry-stat__value--speed { color: #ff4444; }
        .telemetry-stat__value--quali { color: #00ffc8; }
        .telemetry-stat__value--wins { color: #ffd700; }
        .telemetry-stat__value--nat { color: #aaa; font-size: 1rem; }

        .constructor-detail {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 1rem;
        }

        .constructor-detail__title {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #555;
          margin-bottom: 0.5rem;
        }

        .constructor-detail__name {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .constructor-detail__meta {
          font-size: 0.85rem;
          color: #777;
          line-height: 1.6;
        }

        .constructor-table tbody tr { cursor: default; }
        .constructor-table tbody tr:hover { background: rgba(0, 255, 200, 0.04); }

        .constructor-drivers {
          font-size: 0.85rem;
          color: #888;
        }

        .footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.75rem;
          color: #333;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .no-results {
          padding: 3rem;
          text-align: center;
          color: #555;
        }

        .api-error-banner {
          background: rgba(225, 6, 0, 0.12);
          border: 1px solid rgba(225, 6, 0, 0.4);
          color: #ff8888;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .maps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1100px) {
          .maps-grid { grid-template-columns: 1fr 380px; }
        }

        .world-map {
          width: 100%;
          height: auto;
          display: block;
          background: radial-gradient(ellipse at center, #0d1520 0%, #060608 70%);
          border-radius: 6px;
        }

        .world-map__ocean { fill: #0a0e14; }
        .world-map__grid { stroke: rgba(255, 255, 255, 0.04); stroke-width: 1; }
        .world-map__route {
          fill: none;
          stroke: rgba(225, 6, 0, 0.25);
          stroke-width: 1.5;
          stroke-dasharray: 6 4;
        }

        .circuit-marker {
          cursor: pointer;
          transition: transform 0.15s;
        }

        .circuit-marker:hover { transform: scale(1.3); }

        .circuit-marker__dot {
          fill: #555;
          stroke: rgba(255, 255, 255, 0.3);
          stroke-width: 1.5;
        }

        .circuit-marker--completed .circuit-marker__dot { fill: #444; }
        .circuit-marker--current .circuit-marker__dot {
          fill: #e10600;
          stroke: #ff6666;
          filter: drop-shadow(0 0 6px rgba(225, 6, 0, 0.8));
        }
        .circuit-marker--upcoming .circuit-marker__dot { fill: #00ffc8; stroke: rgba(0, 255, 200, 0.5); }
        .circuit-marker--selected .circuit-marker__dot {
          fill: #ffd700;
          stroke: #fff;
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.7));
        }

        .circuit-marker__label {
          fill: #666;
          font-size: 9px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          text-anchor: middle;
          pointer-events: none;
        }

        .circuit-marker--selected .circuit-marker__label,
        .circuit-marker--current .circuit-marker__label { fill: #ccc; }

        .map-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.25);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.75rem;
          color: #777;
        }

        .map-legend__item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .map-legend__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .map-legend__dot--completed { background: #444; }
        .map-legend__dot--current { background: #e10600; box-shadow: 0 0 6px #e10600; }
        .map-legend__dot--upcoming { background: #00ffc8; }

        .circuit-list {
          max-height: 520px;
          overflow-y: auto;
        }

        .circuit-list__item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: background 0.15s;
        }

        .circuit-list__item:hover { background: rgba(225, 6, 0, 0.06); }
        .circuit-list__item--selected { background: rgba(225, 6, 0, 0.12); border-left: 3px solid #e10600; }
        .circuit-list__item--current { border-left: 3px solid #e10600; }

        .circuit-list__round {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          color: #555;
          min-width: 2rem;
        }

        .circuit-list__name {
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 0.15rem;
        }

        .circuit-list__meta {
          font-size: 0.8rem;
          color: #666;
        }

        .circuit-list__badge {
          margin-left: auto;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .circuit-list__badge--completed { background: rgba(255,255,255,0.06); color: #555; }
        .circuit-list__badge--current { background: rgba(225,6,0,0.2); color: #ff6666; }
        .circuit-list__badge--upcoming { background: rgba(0,255,200,0.1); color: #00ffc8; }

        .circuit-detail {
          padding: 1.25rem;
        }

        .circuit-detail__title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .circuit-detail__subtitle {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 1rem;
        }

        .circuit-detail__maps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 700px) {
          .circuit-detail__maps { grid-template-columns: 1fr 1fr; }
        }

        .circuit-map-frame {
          width: 100%;
          height: 220px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          background: #0a0a0c;
        }

        .circuit-track-map {
          width: 100%;
          height: 220px;
          object-fit: contain;
          background: #0a0a0c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.5rem;
        }

        .circuit-map-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #555;
          margin-bottom: 0.4rem;
        }

        .circuit-detail__coords {
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #555;
        }

        .circuit-detail__empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: #555;
        }
      `}</style>

      {error && (
        <div className="api-error-banner">
          Refresh failed: {error} — showing last loaded data.
        </div>
      )}

      <header className="header flex items-center justify-between flex-wrap gap-6 mb-8 pb-6 border-b-2 border-[rgba(225,6,0,0.4)]">
        <div className="header__brand flex items-center gap-4">
          <img src={f1Logo} alt="Formula 1" className="header__logo h-11 w-auto object-contain" />
          <div>
            <h1 className="header__title font-display text-[1.6rem] font-bold uppercase tracking-[0.05em]">
              Grand Prix <span>Dashboard</span>
            </h1>
            <p className="header__subtitle text-[0.95rem] text-[#888] uppercase tracking-[0.15em]">
              Constructor Tracker · {season} Season · Round {round}
            </p>
            <p className="header__updated mt-1 text-[0.8rem] text-[#555] tracking-[0.08em]">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
            </p>
          </div>
        </div>
        <div className="live-badge flex items-center gap-2 bg-[rgba(225,6,0,0.15)] border border-[rgba(225,6,0,0.5)] px-4 py-2 rounded font-display text-xs uppercase tracking-[0.2em]">
          <span className={`live-badge__dot w-2 h-2 bg-[#e10600] rounded-full shadow-[0_0_8px_#e10600] transition-opacity duration-500 ${pulse ? 'opacity-30' : ''}`} />
          Live Data · {REFRESH_INTERVAL_MS / 1000}s refresh
        </div>
      </header>

      <div className="stats-row grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-8">
        <div className="stat-card bg-gradient-to-br from-[#141418] to-[#1a1a20] border border-[rgba(255,255,255,0.06)] border-l-[3px] border-l-[#e10600] p-5 rounded-md">
          <div className="stat-card__label text-xs text-[#666] uppercase tracking-[0.15em] mb-2">Championship Leader</div>
          <div className="stat-card__value font-display text-3xl font-bold text-white">{stats.leader.name.split(' ').pop()}</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-[#141418] to-[#1a1a20] border border-[rgba(255,255,255,0.06)] border-l-[3px] border-l-[#e10600] p-5 rounded-md">
          <div className="stat-card__label text-xs text-[#666] uppercase tracking-[0.15em] mb-2">Leader Points</div>
          <div key={stats.leader.points} className="stat-card__value stat-card__value--accent value--live font-display text-3xl font-bold text-[#00ffc8]">{stats.leader.points}</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-[#141418] to-[#1a1a20] border border-[rgba(255,255,255,0.06)] border-l-[3px] border-l-[#e10600] p-5 rounded-md">
          <div className="stat-card__label text-xs text-[#666] uppercase tracking-[0.15em] mb-2">Total Wins</div>
          <div className="stat-card__value font-display text-3xl font-bold text-white">{stats.totalWins}</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-[#141418] to-[#1a1a20] border border-[rgba(255,255,255,0.06)] border-l-[3px] border-l-[#e10600] p-5 rounded-md">
          <div className="stat-card__label text-xs text-[#666] uppercase tracking-[0.15em] mb-2">Drivers Tracked</div>
          <div className="stat-card__value font-display text-3xl font-bold text-white">{drivers.length}</div>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Dashboard views">
        <button
          role="tab"
          aria-selected={activeTab === 'drivers'}
          className={`tab ${activeTab === 'drivers' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          Driver Standings
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'constructors'}
          className={`tab ${activeTab === 'constructors' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('constructors')}
        >
          Constructor Championship
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'maps'}
          className={`tab ${activeTab === 'maps' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('maps')}
        >
          Circuit Maps
        </button>
      </div>

      {activeTab === 'drivers' && (
        <>
          <div className="controls">
            <div className="search-wrapper">
              <input
                aria-label="Search drivers or teams"
                className="search-input"
                type="text"
                placeholder="Search drivers or teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="team-filters">
              {teams.map((team) => (
                <button
                  key={team}
                  className={`team-chip ${selectedTeam === team ? 'team-chip--active' : ''}`}
                  style={team !== 'All' ? { '--chip-color': getTeamColor(team) } : {}}
                  onClick={() => setSelectedTeam(team)}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          <div className="main-grid">
            <div className="panel">
              <div className="panel__header">Driver Leaderboard</div>
              <div className="table-wrap">
                {filteredDrivers.length === 0 ? (
                  <div className="no-results">No drivers match your search.</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Wins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrivers.map((driver) => (
                        <tr
                          key={driver.id}
                          className={selectedDriver?.id === driver.id ? 'row--selected' : ''}
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              handleDriverClick(driver);
                            }
                          }}
                          onClick={() => handleDriverClick(driver)}
                        >
                          <td className={`pos pos--p${driver.position <= 3 ? driver.position : ''}`}>
                            {driver.position}
                          </td>
                          <td>
                            <span className="driver-name">{driver.name}</span>
                          </td>
                          <td>
                            <span
                              className="team-badge"
                              style={{ '--team-color': getTeamColor(driver.team) }}
                            >
                              {driver.team}
                            </span>
                          </td>
                          <td key={driver.points} className="points value--live">{driver.points}</td>
                          <td className="podium-count">{driver.wins}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel__header">Telemetry & Constructor Detail</div>
              {selectedDriver ? (
                <div className="telemetry-card">
                  <div className="telemetry-card__header">
                    <span className="telemetry-card__number">{selectedDriver.number}</span>
                    <div>
                      <div className="telemetry-card__name">{selectedDriver.name}</div>
                      <div className="telemetry-card__team">{selectedDriver.team}</div>
                    </div>
                  </div>

                  <div className="telemetry-grid">
                    <div className="telemetry-stat">
                      <div className="telemetry-stat__label">Estimated Speed</div>
                      <div key={selectedDriver.topSpeed} className="telemetry-stat__value telemetry-stat__value--speed value--live">
                        {selectedDriver.topSpeed} km/h
                      </div>
                    </div>
                    <div className="telemetry-stat">
                      <div className="telemetry-stat__label">Qualifying Rank</div>
                      <div key={selectedDriver.qualifyingRank} className="telemetry-stat__value telemetry-stat__value--quali value--live">
                        P{selectedDriver.qualifyingRank}
                      </div>
                    </div>
                    <div className="telemetry-stat">
                      <div className="telemetry-stat__label">Race Wins</div>
                      <div className="telemetry-stat__value telemetry-stat__value--wins">
                        {selectedDriver.wins}
                      </div>
                    </div>
                    <div className="telemetry-stat">
                      <div className="telemetry-stat__label">Nationality</div>
                      <div className="telemetry-stat__value telemetry-stat__value--nat">
                        {selectedDriver.nationality}
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const constructor = constructors.find((c) => c.name === selectedDriver.team);
                    return constructor ? (
                      <div className="constructor-detail">
                        <div className="constructor-detail__title">Constructor Details</div>
                        <div className="constructor-detail__name">{constructor.name}</div>
                        <div className="constructor-detail__meta">
                          <div>Engine: {constructor.engine}</div>
                          <div>Base: {constructor.base}</div>
                          <div key={constructor.points}>Championship Points: {constructor.points}</div>
                          <div>Team Wins: {constructor.wins}</div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              ) : (
                <div className="telemetry-card telemetry-card__empty">
                  <div className="telemetry-card__empty-icon">🏎</div>
                  <p>Select a driver from the leaderboard to view telemetry and constructor details.</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Press Esc to deselect</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'constructors' && (
        <div className="panel">
          <div className="panel__header">Constructor Championship Standings</div>
          <div className="table-wrap">
            <table className="constructor-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Constructor</th>
                  <th>Drivers</th>
                  <th>Points</th>
                  <th>Wins</th>
                  <th>Base</th>
                </tr>
              </thead>
              <tbody>
                {sortedConstructors.map((team, index) => (
                  <tr key={team.id}>
                    <td className={`pos pos--p${index + 1 <= 3 ? index + 1 : ''}`}>{index + 1}</td>
                    <td>
                      <span
                        className="team-badge"
                        style={{ '--team-color': getTeamColor(team.name) }}
                      >
                        {team.name}
                      </span>
                    </td>
                    <td className="constructor-drivers">{team.drivers.join(', ')}</td>
                    <td key={team.points} className="points value--live">{team.points}</td>
                    <td>{team.wins}</td>
                    <td style={{ color: '#777', fontSize: '0.9rem' }}>{team.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maps' && (
        <div className="maps-grid">
          <div className="panel">
            <div className="panel__header">{season} Calendar · Global Circuit Map</div>
            {races.length === 0 ? (
              <div className="no-results">
                {calendarError ? `Race calendar unavailable: ${calendarError}` : 'Race calendar unavailable.'}
              </div>
            ) : (
              <>
                <svg
                  className="world-map"
                  viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                  role="img"
                  aria-label="F1 world circuit map"
                >
                  <rect className="world-map__ocean" width={MAP_WIDTH} height={MAP_HEIGHT} />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={`lat-${i}`}
                      className="world-map__grid"
                      x1={0}
                      y1={(MAP_HEIGHT / 4) * i}
                      x2={MAP_WIDTH}
                      y2={(MAP_HEIGHT / 4) * i}
                    />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <line
                      key={`lng-${i}`}
                      className="world-map__grid"
                      x1={(MAP_WIDTH / 8) * i}
                      y1={0}
                      x2={(MAP_WIDTH / 8) * i}
                      y2={MAP_HEIGHT}
                    />
                  ))}
                  {mapRoutePoints && (
                    <polyline className="world-map__route" points={mapRoutePoints} />
                  )}
                  {races.map((race) => {
                    const isSelected = selectedCircuit?.id === race.id;
                    const markerClass = [
                      'circuit-marker',
                      `circuit-marker--${race.status}`,
                      isSelected ? 'circuit-marker--selected' : '',
                    ].join(' ');
                    return (
                      <g
                        key={race.id}
                        className={markerClass}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${race.raceName}`}
                        transform={`translate(${race.coords.x}, ${race.coords.y})`}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleCircuitClick(race);
                          }
                        }}
                        onClick={() => handleCircuitClick(race)}
                      >
                        <circle className="circuit-marker__dot" r={isSelected ? 7 : 5} />
                        {(isSelected || race.status === 'current') && (
                          <text className="circuit-marker__label" y={-10}>
                            R{race.round}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                <div className="map-legend">
                  <span className="map-legend__item">
                    <span className="map-legend__dot map-legend__dot--completed" /> Completed
                  </span>
                  <span className="map-legend__item">
                    <span className="map-legend__dot map-legend__dot--current" /> Current Round
                  </span>
                  <span className="map-legend__item">
                    <span className="map-legend__dot map-legend__dot--upcoming" /> Upcoming
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="panel">
            <div className="panel__header">Race Calendar & Circuit Detail</div>
            <div className="circuit-list">
              {races.map((race) => (
                <div
                  key={race.id}
                  className={[
                    'circuit-list__item',
                    selectedCircuit?.id === race.id ? 'circuit-list__item--selected' : '',
                    race.status === 'current' ? 'circuit-list__item--current' : '',
                  ].join(' ')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${race.raceName}`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleCircuitClick(race);
                    }
                  }}
                  onClick={() => handleCircuitClick(race)}
                >
                  <span className="circuit-list__round">R{race.round}</span>
                  <div>
                    <div className="circuit-list__name">{race.raceName}</div>
                    <div className="circuit-list__meta">
                      {race.locality}, {race.country}
                    </div>
                    <div className="circuit-list__meta">{formatRaceDate(race.date, race.time)}</div>
                  </div>
                  <span className={`circuit-list__badge circuit-list__badge--${race.status}`}>
                    {race.status}
                  </span>
                </div>
              ))}
            </div>

            {selectedCircuit ? (
              <div className="circuit-detail">
                <div className="circuit-detail__title">{selectedCircuit.raceName}</div>
                <div className="circuit-detail__subtitle">
                  {selectedCircuit.circuitName} · {selectedCircuit.locality}, {selectedCircuit.country}
                </div>
                <div className="circuit-detail__maps">
                  <div>
                    <div className="circuit-map-label">Location Map</div>
                    <iframe
                      title={`Map of ${selectedCircuit.circuitName}`}
                      className="circuit-map-frame"
                      src={getOsmEmbedUrl(selectedCircuit.lat, selectedCircuit.lng)}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="circuit-map-label">Track Layout</div>
                    {selectedCircuit.trackMap ? (
                      <img
                        src={selectedCircuit.trackMap}
                        alt={`${selectedCircuit.circuitName} track map`}
                        className="circuit-track-map"
                      />
                    ) : (
                      <div className="circuit-map-frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.85rem' }}>
                        Track map unavailable
                      </div>
                    )}
                  </div>
                </div>
                <div className="circuit-detail__coords">
                  Round {selectedCircuit.round} · {formatRaceDate(selectedCircuit.date, selectedCircuit.time)}
                  <br />
                  Coordinates: {selectedCircuit.lat.toFixed(4)}°, {selectedCircuit.lng.toFixed(4)}°
                </div>
              </div>
            ) : (
              <div className="circuit-detail circuit-detail__empty">
                <p>Select a circuit on the map or calendar to view location & track layout.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Press Esc to deselect</p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        Formula 1 Grand Prix Dashboard · Data via Jolpica F1 API · Not affiliated with FIA
      </footer>
    </div>
  );
}

export default App;