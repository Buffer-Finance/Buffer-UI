import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { BlueBtn } from '@Views/Common/V2-Button';
import { StepButton, StepLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { LeaderboardRules } from './Form/LeaderboardRules';
import { TournamentConditions } from './Form/TournamentConditions';
import { TournamentMeta } from './Form/TournamentMeta';

const btnClasses = '!w-fit !text-f14 !px-3 !py-1 !h-fit mx-4';

export default function HorizontalNonLinearStepper({
  steps,
  activeStateIndex,
  setActiveStep,
  completed,
  setCompleted,
  submitButton,
  isFormFilled,
}: {
  steps: string[];
  activeStateIndex: number;
  setActiveStep: (newIndex: number) => void;
  completed: number[] | null;
  setCompleted: (newIndex: number | null) => void;
  submitButton: JSX.Element;
  isFormFilled: (formIndex: number) => boolean;
}) {
  // const [completed, setCompleted] = React.useState<{
  //   [k: number]: boolean;
  // }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return completed ? completed.length : 0;
  };

  const isLastStep = () => {
    return activeStateIndex === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted() && completed
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStateIndex + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep(activeStateIndex - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    // const newCompleted = completed;
    // newCompleted[activeStateIndex] = true;
    if (!isFormFilled(activeStateIndex)) return;
    setCompleted(activeStateIndex);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(null);
  };

  return (
    <>
      <Stepper
        nonLinear
        activeStep={activeStateIndex}
        alternativeLabel
        sx={{ fontSize: 14, marginTop: '12px' }}
      >
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={completed ? completed.includes(index) : false}
            classes={{ root: '!text-f15' }}
            sx={{
              '& .MuiSvgIcon-fontSizeMedium': {
                scale: '175%',
                marginTop: '8px',
              },
            }}
          >
            <StepButton onClick={handleStep(index)}>
              <StepLabel classes={{ label: '!text-1 !text-f15' }}>
                {label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ textAlign: 'center', fontSize: 14 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 2,
                justifyContent: 'space-between',
                mx: 3,
              }}
            >
              {submitButton}
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <HorizontalTransition value={activeStateIndex}>
              <TournamentMeta />
              <TournamentConditions />
              <LeaderboardRules />
            </HorizontalTransition>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {activeStateIndex > 0 && (
                <BlueBtn onClick={handleBack} className={btnClasses}>
                  Back
                </BlueBtn>
              )}
              <Box sx={{ flex: '1 1 auto' }} />
              <BlueBtn onClick={handleNext} className={btnClasses}>
                Next
              </BlueBtn>
              {activeStateIndex !== steps.length &&
                (completed && completed.includes(activeStateIndex) ? (
                  <Typography
                    variant="caption"
                    sx={{ display: 'inline-block' }}
                  >
                    Step {activeStateIndex + 1} already completed
                  </Typography>
                ) : (
                  <BlueBtn onClick={handleComplete} className={btnClasses}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </BlueBtn>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </>
  );
}
