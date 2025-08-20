import useOrientation from '@/hooks/useOrientation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { db } from '@/hooks/useInstantDb';
import { useUserProfile } from '@/hooks/useUserProfile';
import { X } from 'lucide-react';
import { useState } from 'react';
import Login from '../Auth/Login';
import pwaLogo from './logos/pwa.svg';
import reactLogo from './logos/react_ed.svg';
import recoilLogo from './logos/recoil.svg';
import rrLogo from './logos/rr.svg';
import tsLogo from './logos/ts.svg';
import viteLogo from './logos/vite.svg';

function Welcome() {
    const isPortrait = useOrientation();

    const { user } = db.useAuth();

    const { profile } = useUserProfile();

    const [toggle, setToggle] = useState(true);

    const imageSize = 'w-1/10 h-1/10 m-1';
    const reactImageSize = isPortrait ? 'w-2/5 h-1/3' : 'w-1/3 h-2/5';

    if (user) {
        return (
            <div>
                <meta name="title" content="Welcome" />
                {toggle && (
                    <Card className="mx-2 my-3 bg-green-50 p-4">
                        <CardContent className="space-y-4">
                            <div className="flex justify-between space-y-3">
                                <div>
                                    <Label className="text-muted-foreground text-xl">
                                        Selamat Datang, {profile?.fullName || '-'} 👋
                                    </Label>
                                </div>
                                <Button variant={'outline'} size={'sm'} onClick={() => setToggle(!toggle)}>
                                    {' '}
                                    <X />{' '}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div
                    className={`mt-4 flex h-full w-full items-center justify-center ${isPortrait ? 'flex-col' : 'flex-row'}`}
                >
                    <img alt="react-router" src={rrLogo} className={imageSize} />
                    <img alt="vite" src={viteLogo} className={imageSize} />
                    <img alt="typescript" src={tsLogo} className={imageSize} />
                    <img alt="react" src={reactLogo} className={reactImageSize} />
                    <img alt="recoil" src={recoilLogo} className={imageSize} />
                    <img alt="pwa" src={pwaLogo} className={imageSize} />
                </div>
            </div>
        );
    }
    return <Login />;
}

export default Welcome;
