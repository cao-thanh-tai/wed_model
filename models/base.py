from abc import ABC, abstractmethod
from typing import Any


class ModelInterface(ABC):
    @abstractmethod
    def metadata(self) -> dict[str, Any]:
        """Return the public metadata used by the API and frontend."""
        raise NotImplementedError

    @abstractmethod
    def predict(self, input_data: Any) -> Any:
        """Run inference for already validated input data."""
        raise NotImplementedError
