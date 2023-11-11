'use server';

export const createSprintAction = async (
  prevState: any,
  formData: FormData
) => {
  console.log('---------prevState----------');
  console.log(prevState);
  //   console.log(formData);

  // other info
  // const createdUserId = user?.id!;
  // const createdUserName = user?.username ? user?.username : user?.firstName!;
  // const isInProgress = true; // when the sprint starts
  // const projectId = params.projectId;
  // // form values
  // const sprintName = formData.get('sprintName')?.toString()!;
  // const sprintDescription = formData.get('sprintDescription')?.toString()!;
  // const startDate = formData.get('startDate')?.toString()!;
  // const endDate = formData.get('endDate')?.toString()!;
  // const sprint = await prisma.sprint.create({
  //   data: {
  //     createdUserId,
  //     createdUserName,
  //     sprintName,
  //     sprintDescription,
  //     startDate,
  //     endDate,
  //     isInProgress,
  //     project: {
  //       connect: {
  //         uniqueId: projectId,
  //       },
  //     },
  //   },
  // });
};
