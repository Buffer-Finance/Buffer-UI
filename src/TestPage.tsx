import { useEffect, useState } from 'react';

const TestPage: React.FC<any> = ({}) => {
  const [user, setUser] = useState({ name: 'amit', age: 23 });
  useStateChange(user);
  return (
    <div>
      Hello
      <input
        className="text-[black]"
        value={user.name}
        onChange={(e) => {
          setUser((d) => {
            return {
              ...d,
              name: e.target.value,
            };
          });
        }}
      />
      <input
        className="text-[black]"
        value={user.age}
        onChange={(e) => {
          setUser((d) => {
            return {
              ...d,
              age: e.target.value,
            };
          });
        }}
      />
    </div>
  );
};

export { TestPage };
const useStateChange = (user) => {
  useEffect(() => {
    console.log('name changed');
  }, [user.name]);
  useEffect(() => {
    console.log('age changed');
  }, [user.age]);
  useEffect(() => {
    console.log('user changed');
  }, [user]);
  return {};
};
