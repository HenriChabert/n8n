export const routes = [
	{
		path: '/',
		name: "Home",
		redirect: (to) => {
			return { name: VIEWS.WORKFLOWS };
		},
		meta: {
			middleware: ['authenticated'],
		},
	},
	{
		path: '/collections/:id',
		name: VIEWS.COLLECTION,
		components: {
			default: TemplatesCollectionView,
			sidebar: MainSidebar,
		},
		meta: {
			templatesEnabled: true,
			telemetry: {
				getProperties(route: RouteLocation) {
					const templatesStore = useTemplatesStore();
					return {
						collection_id: route.params.id,
						wf_template_repo_session_id: templatesStore.currentSessionId,
					};
				},
			},
			getRedirect: getTemplatesRedirect,
			middleware: ['authenticated'],
		},
	},
];
