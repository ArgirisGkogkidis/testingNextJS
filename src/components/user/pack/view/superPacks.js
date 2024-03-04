import React, { useState, useEffect } from 'react';
// Adjust this import according to your setup

const ViewPacks = (props) => {
  const { tracking, accounts } = props;
  const [superPacks, setSuperPacks] = useState([]);

  useEffect(() => {
    const fetchPacks = async () => {
      const superPackHashes = await tracking.methods.getUserSuperPacks(accounts).call();
      console.log(superPackHashes)
      const superPackDetailsPromises = superPackHashes.map(async (hash) => {
        const internalPackHashes = await tracking.methods.getSuperPackMapping(hash).call();
        const internalPackDetailsPromises = internalPackHashes.map(async (internalHash) => {
          console.log(internalHash);
          return tracking.methods.viewPack(internalHash).call();
        });
        const internalPacks = await Promise.all(internalPackDetailsPromises);
        console.log(internalPacks)
        return { hash, internalPackHashes, internalPacks };
      });
      const superPacks = await Promise.all(superPackDetailsPromises);
      setSuperPacks(superPacks);
    };

    fetchPacks();
  }, [accounts]);

  return (
    <div>
      <h2>My Packs</h2>
      {superPacks.map((superPack) => (
        <div key={superPack.hash}>
          <h3>Super Pack: {superPack.hash}</h3>
          <ul>
            {superPack.internalPacks.map((pack, index) => (
              <li key={index}>Pack {superPack.internalPackHashes[index]} - Length: {pack[0]} - {pack[1].map((tknd, index) => (<li key={index}>Token:{tknd}</li>))}</li> // Expand this according to your pack details
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ViewPacks;
