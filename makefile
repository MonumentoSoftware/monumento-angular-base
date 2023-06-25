# Extract the second and all subsequent words from MAKECMDGOALS
ARG := $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))

# Define a new target with the name stored in ARG, with no prerequisites
# and a recipe that does nothing (@true suppresses command output)
$(eval $(ARG):;@true)

shared_component:
	@echo "Making shared component $(ARG)"
	ionic g c shared/components/$(ARG) 

presentation_module:
	@echo "Making presentation module $(ARG)"
	ionic g m presentation/$(ARG) --routing

presentation_component:
	@echo "Making presentation component $(ARG)"
	ionic g c  presentation/$(ARG)

root_component:
	@echo "Making root component $(ARG)"
	ionic g c root/$(ARG)

make serve:
	ionic serve

install_pwa:
	ng add @angular/pwa